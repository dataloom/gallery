/*
 * @flow
 */

import * as NeuronActionTypes from './NeuronActionTypes';

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

export function neuronSubscribeRequest(topic :string) :Object {

  return {
    type: NeuronActionTypes.NEURON_SUBSCRIBE_REQUEST,
    topic
  };
}

export function neuronSubscribeSuccess(subscription :any) :Object {

  return {
    type: NeuronActionTypes.NEURON_SUBSCRIBE_SUCCESS,
    subscription
  };
}

export function neuronSubscribeFailure() :Object {

  return {
    type: NeuronActionTypes.NEURON_SUBSCRIBE_FAILURE
  };
}

export function neuronSignal(frame :any) :Object {

  return {
    type: NeuronActionTypes.NEURON_SIGNAL,
    frame
  };
}
