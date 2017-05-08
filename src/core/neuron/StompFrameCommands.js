/*
 * @flow
 */

/*
 * http://jmesnil.net/stomp-websocket/doc/stomp.html
 * http://stomp.github.io/stomp-specification-1.1.html
 */

export const CLIENT_COMMANDS = {
  ABORT: 'ABORT',
  ACK: 'ACK',
  BEGIN: 'BEGIN',
  COMMIT: 'COMMIT',
  CONNECT: 'CONNECT',
  DISCONNECT: 'DISCONNECT',
  NACK: 'NACK',
  SEND: 'SEND',
  STOMP: 'STOMP',
  SUBSCRIBE: 'SUBSCRIBE',
  UNSUBSCRIBE: 'UNSUBSCRIBE'
};

export const SERVER_COMMANDS = {
  CONNECTED: 'CONNECTED',
  ERROR: 'ERROR',
  MESSAGE: 'MESSAGE',
  RECEIPT: 'RECEIPT'
};
