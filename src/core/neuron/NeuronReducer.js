/*
 * @flow
 */

import Immutable from 'immutable';

import * as NeuronActionTypes from './NeuronActionTypes';

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  subscriptions: {}
});

export default function neuronReducer(state :Map<*, *> = INITIAL_STATE, action :Object) :Map<*, *> {

  switch (action.type) {

    case NeuronActionTypes.NEURON_CONNECT_SUCCESS:
    case NeuronActionTypes.NEURON_CONNECT_FAILURE:
    case NeuronActionTypes.NEURON_SUBSCRIBE_SUCCESS:
    case NeuronActionTypes.NEURON_SUBSCRIBE_FAILURE:
      return state;

    default:
      return state;
  }
}
