// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
    agent.add('Ayy lmaoo fam');
}

  function nextStop(agent){


    var request = require('request');
    var url = "https://transitime-api.goswift.ly/api/v1/key/919b9c3d/agency/ucf/command/predictions?format=json&rs=10319,2440773";

    return new Promise((resolve, reject) => {
      request.get(url, (error,response,body) =>{
        var data = JSON.parse(body);
        if(data.predictions[0].destinations[0].predictions[0] != [] ){
          var nextBus = parseInt(data.predictions[0].destinations[0].predictions[0].min)+1;
          var text = JSON.stringify(body);

          if(nextBus != 1){
            let output = agent.add(nextBus + ' minutes');
            resolve(output);
          }
          else{
            let output = agent.add(nextBus + ' minute');
            resolve(output);
          }
          console.log(nextBus);
          
        }
        else{
          let output = agent.add('No shuttle');
          resolve(output);
        }
        
      });
    });

    
  }


  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Next Stop', nextStop);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
