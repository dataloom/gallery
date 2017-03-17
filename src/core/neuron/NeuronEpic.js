/*
 * @flow
 */

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

import * as NeuronActionFactory from './NeuronActionFactory';
import * as NeuronActionTypes from './NeuronActionTypes';

import { SERVER_COMMANDS } from './StompFrameCommands';

/*
 * SockJS client instance
 *
 * https://github.com/sockjs/sockjs-client
 * https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/websocket.html
 */
const socketClient = new SockJS('http://localhost:8081/neuron');

/*
 * Stomp client instance
 *
 * https://github.com/jmesnil/stomp-websocket
 * http://jmesnil.net/stomp-websocket/doc
 * http://jmesnil.net/stomp-websocket/doc/stomp.html
 */
const stompClient = Stomp.over(socketClient);

/*
 * initialize WebSocket connection to Neuron on app startup
 *
 * TODO: implement logic to retry to connect
 */
export function initializeNeuron(reduxStore :any) {

  const onConnectCallback = (frame :any) => {

    switch (frame.command) {

      case SERVER_COMMANDS.CONNECTED:
        reduxStore.dispatch(NeuronActionFactory.neuronConnectSuccess(frame));
        // TODO: once connected, subscribe to the necessary topics/channels/notifications
        // reduxStore.dispatch(NeuronActionFactory.neuronSubscribeRequest('events'));
        // reduxStore.dispatch(NeuronActionFactory.neuronSubscribeRequest('signals'));
        break;

      default:
        reduxStore.dispatch(NeuronActionFactory.neuronConnectFailure(frame));
        break;
    }
  };

  const onErrorCallback = () => {
    reduxStore.dispatch(NeuronActionFactory.neuronConnectFailure());
  };

  stompClient.connect(
    {},
    onConnectCallback,
    onErrorCallback
  );
}

function neuronSubscribeRequestEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(NeuronActionTypes.NEURON_SUBSCRIBE_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .create((observer :Observer) => {
          const subscription = stompClient.subscribe(`/topic/${action.topic}`, (frame :any) => {
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

  return action$
    .ofType(NeuronActionTypes.NEURON_ON_MESSAGE)
    .map((action :Action) => {
      switch (action.frame.command) {
        case SERVER_COMMANDS.MESSAGE:
        default:
          return {
            type: 'NOOP'
          };
      }
    });
}

export default combineEpics(
  neuronSubscribeRequestEpic,
  neuronOnMessageEpic
);
