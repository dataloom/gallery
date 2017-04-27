/*
 * @flow
 */

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// injected by Webpack.DefinePlugin
declare var __PROD__;

/*
 * SockJS client instance
 *
 * https://github.com/sockjs/sockjs-client
 * https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/websocket.html
 */
let socketClient :?Object = null;

/*
 * Stomp client instance
 *
 * https://github.com/jmesnil/stomp-websocket
 * http://jmesnil.net/stomp-websocket/doc
 * http://jmesnil.net/stomp-websocket/doc/stomp.html
 */
let stompClient :?Object = null;

export function initializeStompClient() :Object {

  if (socketClient) {
    socketClient.close();
    socketClient = null;
    stompClient = null;
  }

  // TODO: get an actual URL depending on the enviroment
  socketClient = new SockJS('http://localhost:8081/notifier');
  stompClient = Stomp.over(socketClient);

  if (__PROD__) {
    // disable logging in prod
    stompClient.debug = () => {};
  }

  return stompClient;
}

export function getStompClient() :Object {

  if (!stompClient) {
    return initializeStompClient();
  }

  return stompClient;
}
