/* @flow */
import { PropTypes } from 'react';

export type Type = {
  name: string,
  namespace: string
};

export const TypePropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired
});