/* @flow */
import { PropTypes } from 'react';

import type Type from '../utils/TypeStorage';
import { TypePropType } from '../utils/TypeStorage';

export type PropertyType = {
  id:string,
  type:Type,
  title:string,
  description?:string,
  datatype:string
};

export const PropertyTypePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: TypePropType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  datatype: PropTypes.string
});
