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

const ERROR_STOMP_CLIENT_NOT_CONNECTED :string = 'ERROR_STOMP_CLIENT_NOT_CONNECTED';
const ERROR_STOMP_CLIENT_NOT_INITIALIZED :string = 'ERROR_STOMP_CLIENT_NOT_INITIALIZED';

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
    .mergeMap(() => {
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
    .map(() => {
      retryCount = 0;
      return NEURON_NO_OP;
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

function neuronSubscribeRequestEpic(action$ :Observable<Action>, store :Object) :Observable<Action> {

  return action$
    .ofType(NeuronActionTypes.NEURON_SUBSCRIBE_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .create((observer :Observer) => {
          const stompClient = getStompClient();
          if (!stompClient) {
            observer.error(ERROR_STOMP_CLIENT_NOT_INITIALIZED);
          }
          else if (!stompClient.connected) {
            observer.error(ERROR_STOMP_CLIENT_NOT_CONNECTED);
          }
          else {
            const topic :string = action.topic;
            const subId :string = store.getState().getIn(['neuron', 'topicToSubIdMap', topic]);
            const subscriptions :Map = store.getState().getIn(['neuron', 'subscriptions']);
            if (subscriptions.has(subId)) {
              return;
            }
            const subscription = stompClient.subscribe(topic, (frame :Object) => {
              observer.next({
                frame
              });
            });
            observer.next({
              subscription,
              topic
            });
          }
        })
        .mergeMap((message :any) => {
          if (message.subscription) {
            return Observable.of(
              NeuronActionFactory.neuronSubscribeSuccess(message.subscription, message.topic)
            );
          }
          return Observable.of(
            NeuronActionFactory.neuronOnMessage(message.frame)
          );
        })
        .retryWhen((errors :Observable) => {
          return errors.mergeMap((error) => {
            // if the error is that we're not connected, retry when we connect successfully
            if (error === ERROR_STOMP_CLIENT_NOT_CONNECTED) {
              return action$.ofType(NeuronActionTypes.NEURON_CONNECT_SUCCESS);
            }
            // otherwise, retry in 1s
            return Observable.timer(1000);
          });
        })
        .catch(() => {
          return Observable.of(
            NeuronActionFactory.neuronSubscribeFailure()
          );
        });
    });
}

function neuronUnsubscribeRequestEpic(action$ :Observable<Action>, store :Object) :Observable<Action> {

  return action$
    .ofType(NeuronActionTypes.NEURON_SUBSCRIBE_REQUEST)
    .map(() => {
      // TODO: add unsubscribe logic
      return NEURON_NO_OP;
    });
}

function neuronOnMessageEpic(action$ :Observable<Action>) :Observable<Action> {

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
  neuronUnsubscribeRequestEpic,
  neuronOnMessageEpic
);
