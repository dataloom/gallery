/*
 * @flow
 */

import Immutable from 'immutable';

import * as NeuronActionTypes from './NeuronActionTypes';

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  isConnected: false,
  subscriptions: {},
  topicToSubIdMap: {}
});

export default function neuronReducer(state :Map<*, *> = INITIAL_STATE, action :Object) :Map<*, *> {

  switch (action.type) {

    case NeuronActionTypes.NEURON_CONNECT_REQUEST:
      return state.set('isConnected', false);

    case NeuronActionTypes.NEURON_CONNECT_SUCCESS:
      return state.set('isConnected', true);

    case NeuronActionTypes.NEURON_CONNECT_FAILURE:
      return state.set('isConnected', false);

    case NeuronActionTypes.NEURON_SUBSCRIBE_SUCCESS: {

      const subscription :Map = Immutable.fromJS(action.subscription);
      subscription.set('topic', action.topic);

      return state
        .setIn(['subscriptions', action.subscription.id], subscription)
        .setIn(['topicToSubIdMap', action.topic], action.subscription.id);
    }

    case NeuronActionTypes.NEURON_UNSUBSCRIBE_SUCCESS: {

      const subscriptionId :string = state.getIn(['topicToSubIdMap', action.topic]);
      return state
        .deleteIn(['topicToSubIdMap', action.topic])
        .deleteIn(['subscriptions', subscriptionId]);
    }

    case NeuronActionTypes.NEURON_SUBSCRIBE_FAILURE:
    case NeuronActionTypes.NEURON_UNSUBSCRIBE_FAILURE:
    case NeuronActionTypes.NEURON_ON_MESSAGE:
      return state;

    default:
      return state;
  }
}
