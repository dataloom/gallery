/*
 * @flow
 */

// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';

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

// export function initializeStompClient() :Object {
//
//   if (socketClient) {
//     socketClient.close();
//     socketClient = null;
//     stompClient = null;
//   }
//
//   // TODO: determining enviroment urls and ports needs to be refactored, perhaps somewhere in core/
//   const host = window.location.host;
//   const hostName = (host.startsWith('www.')) ? host.substring('www.'.length) : host;
//   const baseUrl = (__PROD__) ? `https://api.${hostName}` : 'http://localhost:8081';
//   const neuronUrl = `${baseUrl}/neuron`;
//
//   socketClient = new SockJS(neuronUrl);
//   stompClient = Stomp.over(socketClient);
//
//   if (__PROD__) {
//     // disable logging in prod
//     stompClient.debug = () => {};
//   }
//
//   return stompClient;
// }
//
// export function getStompClient() :Object {
//
//   if (!stompClient) {
//     return initializeStompClient();
//   }
//
//   return stompClient;
// }
