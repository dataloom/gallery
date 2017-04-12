/*
 * @flow
 */

import {
  combineEpics
} from 'redux-observable';

import {
  Observable
} from 'rxjs';

import * as NeuronActionFactory from './NeuronActionFactory';
import * as NeuronActionTypes from './NeuronActionTypes';

import {
  getStompClient,
  initializeStompClient
} from './NeuronStompClient';

import {
  SERVER_COMMANDS
} from './StompFrameCommands';

const RETRY_DELAY :number = 1000; // in milliseconds
const MAX_RETRY_DELAY :number = 10 * 1000; // in milliseconds
const MAX_RETRY_COUNT :number = 10;

// TODO: figure out how to handle no-op situations
const NEURON_NO_OP :Object = {
  type: 'NEURON_NO_OP'
};

let retryCount :number = 0;

function computeReconnectDelayTimeout() :number {

  let delay :number = RETRY_DELAY * retryCount;
  if (delay >= MAX_RETRY_DELAY) {
    delay = MAX_RETRY_DELAY;
  }

  return delay;
}

function neuronConnectRequestEpic(action$ :Observable<Action>, reduxStore :Object) :Observable<Action> {

  return action$
    .ofType(NeuronActionTypes.NEURON_CONNECT_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .create((observer :Observer) => {
          initializeStompClient().connect(
            {},
            (frame :Object) => {
              observer.next(frame);
            },
            () => {
              observer.error();
            }
          );
        })
        .mergeMap((frame :Object) => {
          switch (frame.command) {
            case SERVER_COMMANDS.CONNECTED:
              return Observable.of(
                NeuronActionFactory.neuronConnectSuccess(frame)
              );
            default:
              return Observable.of(
                NeuronActionFactory.neuronConnectFailure()
              );
          }
        })
        .catch(() => {
          return Observable.of(
            NeuronActionFactory.neuronConnectFailure()
          );
        });
    });

}

function neuronConnectSuccessEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(NeuronActionTypes.NEURON_CONNECT_SUCCESS)
    .mergeMap(() => {
      retryCount = 0;
      return Observable.of(NEURON_NO_OP);
    });
}

function neuronConnectFailureEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(NeuronActionTypes.NEURON_CONNECT_FAILURE)
    .mergeMap(() => {
      if (retryCount > MAX_RETRY_COUNT) {
        return Observable.of(NEURON_NO_OP);
      }
      retryCount += 1; // having this here means the delay will never be 0; could be considered a bug
      return Observable
        .of(NeuronActionFactory.neuronConnectRequest())
        .delay(computeReconnectDelayTimeout());
    });
}

function neuronSubscribeRequestEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(NeuronActionTypes.NEURON_SUBSCRIBE_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .create((observer :Observer) => {
          const subscription = getStompClient().subscribe(`/topic/${action.topic}`, (frame :Object) => {
            observer.next({
              frame
            });
          });
          observer.next({
            subscription
          });
        })
        .mergeMap((message :any) => {
          if (message.subscription) {
            return Observable.of(
              NeuronActionFactory.neuronSubscribeSuccess(message.subscription)
            );
          }
          return Observable.of(
            NeuronActionFactory.neuronOnMessage(message.frame)
          );
        })
        .catch(() => {
          return Observable.of(
            NeuronActionFactory.neuronSubscribeFailure()
          );
        });
    });
}

function neuronOnMessageEpic(action$ :Observable<Action>) :Observable<Action> {

  // TODO: this doesn't do anything yet
  return action$
    .ofType(NeuronActionTypes.NEURON_ON_MESSAGE)
    .map((action :Action) => {
      try {
        // TODO: consider dispatch specific action based on signal.type
        const signal = JSON.parse(action.frame.body);
        return NeuronActionFactory.neuronSignal(signal);
      }
      catch (e) {
        return NeuronActionFactory.neuronSignal(action.frame.body);
      }
    });
}

/*
 * TODO: not sure if I like exposing the initialization step here and in this way
 */
export function initializeNeuron(reduxStore :any) {

  reduxStore.dispatch(NeuronActionFactory.neuronConnectRequest());
}

export default combineEpics(
  neuronConnectRequestEpic,
  neuronConnectSuccessEpic,
  neuronConnectFailureEpic,
  neuronSubscribeRequestEpic,
  neuronOnMessageEpic
);
