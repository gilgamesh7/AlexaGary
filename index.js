/*jslint es6 */

'use strict';

//import ask-sdk-core
const Alexa = require('ask-sdk-core');

//import http
const https = require('https');

//skill name
const appName = 'Gary Phillips';

function getCNJoke(enemyName) {
    return new Promise(((resolve, reject) => {
      var options = {
          host: 'api.icndb.com',
          port: 443,
          path: `/jokes/random?limitTo=[nerdy]&firstName=${enemyName}&lastName=`,
          method: 'GET',
      };
      
      const request = https.request(options, (response) => {
        response.setEncoding('utf8');
        let returnData = '';
  
        response.on('data', (chunk) => {
          returnData += chunk;
        });
  
        response.on('end', () => {
          resolve(JSON.parse(returnData));
        });
  
        response.on('error', (error) => {
          reject(error);
        });
      });
      request.end();
    }));
  }
  
//code for the handlers
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        //welcome message
        let speechText = 'Phillips. Monsignor Gary Phillips. Here to help !';
        //welcome screen message
        let displayText = "Phillips. Monsignor Gary Phillips. Here to help !";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(appName, displayText)
            .getResponse();
    }
};

//implement custom handlers
const QuoteIntentHandler={
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
                handlerInput.requestEnvelope.request.intent.name === 'QuoteIntent';
    },
    async handle(handlerInput){
        let intent = handlerInput.requestEnvelope.request.intent;
        let enemyName = intent.slots.enemyName.value;

        if (enemyName) {
            const response=await getCNJoke(enemyName);
            console.log(response);
            let speechText = `Do not mess with ${enemyName} : ${response.value.joke}`;
            let displayText=response.value.joke;
        
            return handlerInput.responseBuilder
                    .speak(speechText)
                    .withSimpleCard(displayText)
                    .withShouldEndSession(false)
                    .getResponse();
        } else {
            return handlerInput.responseBuilder
                .addDelegateDirective(intent)
                .getResponse();
        }
    }
};

const FemaleVoiceIntentHandler={
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'FemaleVoiceIntent';
    },
    handle(handlerInput){
        let speechText="Thats because you couldnt get your head around SSML. Talk to Pareen.";

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

//end Custom handlers

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        //help text for your skill
        let speechText = 'Ask me for help with any your problems! ';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(appName, speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        let speechText = 'Glad to be of help ! Remember, you are gorgeous !';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(appName, speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};

//Lambda handler function
//Remember to add custom request handlers here
exports.handler = Alexa.SkillBuilders.custom()
     .addRequestHandlers(LaunchRequestHandler,
                         QuoteIntentHandler,
                         FemaleVoiceIntentHandler,
                         HelpIntentHandler,
                         CancelAndStopIntentHandler,
                         SessionEndedRequestHandler).lambda();