/*
 * @flow
 */

import * as NeuronActionTypes from './NeuronActionTypes';

export function neuronConnectRequest() :Object {

  return {
    type: NeuronActionTypes.NEURON_CONNECT_REQUEST
  };
}

export function neuronConnectSuccess(frame :any) :Object {

  return {
    type: NeuronActionTypes.NEURON_CONNECT_SUCCESS,
    frame
  };
}

export function neuronConnectFailure(frame :?any) :Object {

  return {
    type: NeuronActionTypes.NEURON_CONNECT_FAILURE,
    frame
  };
}

export function neuronSubscribeRequest(destination :string) :Object {

  const topic = `/topic/${destination}`;

  return {
    type: NeuronActionTypes.NEURON_SUBSCRIBE_REQUEST,
    topic
  };
}

export function neuronSubscribeSuccess(subscription :any, topic :string) :Object {

  return {
    type: NeuronActionTypes.NEURON_SUBSCRIBE_SUCCESS,
    subscription,
    topic
  };
}

export function neuronSubscribeFailure() :Object {

  return {
    type: NeuronActionTypes.NEURON_SUBSCRIBE_FAILURE
  };
}

export function neuronUnsubscribeRequest(destination :string) :Object {

  const topic = `/topic/${destination}`;

  return {
    type: NeuronActionTypes.NEURON_UNSUBSCRIBE_REQUEST,
    topic
  };
}

export function neuronUnsubscribeSuccess(topic :string) :Object {

  return {
    type: NeuronActionTypes.NEURON_UNSUBSCRIBE_SUCCESS,
    topic
  };
}

export function neuronUnsubscribeFailure() :Object {

  return {
    type: NeuronActionTypes.NEURON_UNSUBSCRIBE_FAILURE
  };
}

export function neuronOnMessage(frame :any) :Object {

  return {
    type: NeuronActionTypes.NEURON_ON_MESSAGE,
    frame
  };
}

export function neuronSignal(signal :any) :Object {

  return {
    type: NeuronActionTypes.NEURON_SIGNAL,
    signal
  };
}

/*
 *
 *
 *
 */

export function subscribeToAclKeyRequest(aclKey :UUID[]) :Object {

  const aclKeyPath :string = aclKey.join('/');
  const destination :string = `aclkey/${aclKeyPath}`;
  return neuronSubscribeRequest(destination);
}

export function unsubscribeFromAclKeyRequest(aclKey :UUID[]) :Object {

  const aclKeyPath :string = aclKey.join('/');
  const destination :string = `aclkey/${aclKeyPath}`;
  return neuronUnsubscribeRequest(destination);
}
