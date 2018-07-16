/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Text, Card, Image, Suggestion, Payload} = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
admin.initializeApp(); 
const db = admin.firestore();
const { Carousel } = require('actions-on-google');

const version = '2.4';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add('Welcome to the job search app!');
    console.log('Using version: ' + version);

    agent.add('What kind of job are you looking for?');
    agent.add(new Suggestion('health care'));
    agent.add(new Suggestion('architect'));
    agent.add(new Suggestion('builder'));
  }

  function searchJob(agent) {
    // Get parameters from Dialogflow to convert

    const jobname = agent.parameters.job;
    const jobtype = agent.parameters.jobtype;
    
    console.log(`User requested to search for job=${jobname} and jobtype=${jobtype}`);

    let jobs = db.collection('jobs');

    if (agent.requestSource === agent.ACTIONS_ON_GOOGLE) {
      // this is an async task
      // Promise return is required

      return jobs
      .where("jobname", "==", jobname)
      //.where("category", "==", jobtype)
      .limit(5)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          const jobs = querySnapshot.docs.map((job) => {
            console.log('RESULTADO parcial: ' + job.get('title'));
            return {
              title: job.get('title'),
              description: 'Location: ' + job.get('city'),
              image: {
                url: job.get('imageurl'),
                accessibilityText: 'Works With the Google Assistant logo',
              },
            };
          })
          let carouselItems = {};
          for (var j=0;jobs.length;j++) {
            carouselItems[j]=jobs[j];
          }
          agent.add(`These are the results for ${jobname} jobs:`);
          let carousel = new Carousel({title: 'Google Assistant',  
                                       items: carouselItems});
          agent.add(carousel);
        }
        else {
          agent.add(`There are no jobs for that parameters`);
        }
      })
      .catch(function (err) {
        console.log('ERROR: ' + err);
        agent.add('There was an error retrieving the job');
      });
    }
    else {
      return jobs
      .where("jobname", "==", jobname)
      //.where("category", "==", jobtype)
      .limit(5)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          const job = querySnapshot.docs[0];
          console.log('RESULTADO: ' + job.get('title'));
          agent.add(`These are the results for ${jobname} jobs:`);
          agent.add(new Card({
            title: job.get('title'),
            imageUrl: job.get('imageurl'),
            text: 'Location: ' + job.get('city'),
            buttonText: 'More info',
            buttonUrl: job.get('url')
          }));
        }
        else {
          agent.add(`There are no jobs for that parameters`);
        }
      })
      .catch(function (err) {
        console.log('ERROR: ' + err);
        agent.add('There was an error retrieving the job');
      });
    }
  }

  function fallback(agent) {
    agent.add('Woah! Its getting a little hot in here.');
    agent.add(`I didn't get that, can you try again?`);
  }

  let intentMap = new Map(); // Map functions to Dialogflow intent names
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Search Job', searchJob);
  intentMap.set('Default Fallback Intent', fallback);
  agent.handleRequest(intentMap);
});
