# Job Search

## Setup
This example uses dialogflow fulfillment with firebase. 

tup: Firebase CLI 

1. [Sign up for or sign into Dialogflow](https://console.dialogflow.com/api-client/#/login) and [create a agent](https://dialogflow.com/docs/agents#create_an_agent)
1. Go to your agent's settings and [Restore from zip](https://dialogflow.com/docs/agents#export_and_import) using the `dialogflow-agent.zip` in this directory (Note: this will overwrite your existing agent)
1. `cd` to the `functions` directory
1. Run `npm install`
1. Install the Firebase CLI by running `npm install -g firebase-tools`
1. Login to your Google account with `firebase login`
1. Add your project to the sample with `firebase use [project ID]` [find your project ID here](https://dialogflow.com/docs/agents#settings)
1. Run `firebase deploy --only functions:dialogflowFulfillmentLibAdvancedSample`
1. Paste the URL into your Dialogflow agent's fulfillment

## References and How to report bugs
* Dialogflow documentation: [https://docs.dialogflow.com](https://docs.dialogflow.com).
* If you find any issues, please open a bug on [GitHub](https://github.com/dialogflow/dialogflow-fulfillment-nodejs/issues).
* Questions are answered on [StackOverflow](https://stackoverflow.com/questions/tagged/dialogflow).

## How to make contributions?
Please read and follow the steps in the CONTRIBUTING.md.

## License
See LICENSE.md.

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).
