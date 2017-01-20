/* @flow */
import { PropTypes } from 'react';

import type { PropertyType } from '../propertytype/PropertyTypeStorage';
import { PropertyTypePropType } from '../propertytype/PropertyTypeStorage';
import type { Type } from '../utils/TypeStorage';
import { TypePropType } from '../utils/TypeStorage';

export const EntityTypePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(PropertyTypePropType),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: TypePropType.isRequired,
});

export type EntitySet = {
  id:string,
  type:Type,
  name:string,
  title:string,
  description:string,
  propertyTypes:PropertyType[],
};

export const EntitySetPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: TypePropType.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  entityType: EntityTypePropType
});
