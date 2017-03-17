/*
 * @flow
 */

import Immutable from 'immutable';

import * as NeuronActionTypes from './NeuronActionTypes';

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  isConnected: false,
  subscriptions: {}
});

export default function neuronReducer(state :Map<*, *> = INITIAL_STATE, action :Object) :Map<*, *> {


  switch (action.type) {

    case NeuronActionTypes.NEURON_CONNECT_SUCCESS:
      console.log(action);
      return state.set('isConnected', true);

    case NeuronActionTypes.NEURON_CONNECT_FAILURE:
      console.log(action);
      return state.set('isConnected', false);

    case NeuronActionTypes.NEURON_SUBSCRIBE_SUCCESS:
    case NeuronActionTypes.NEURON_SUBSCRIBE_FAILURE:
    case NeuronActionTypes.NEURON_ON_MESSAGE:
      console.log(action);
      return state;

    default:
      return state;
  }
}
