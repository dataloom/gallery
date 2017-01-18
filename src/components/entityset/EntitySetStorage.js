/* @flow */
import { schema } from 'normalizr';
import { PropTypes } from 'react';

import { Permission } from '../../core/permissions/Permission';
import type { PropertyType } from '../propertytype/PropertyTypeStorage';
import { PropertyTypePropType, PropertyTypeNschema } from '../propertytype/PropertyTypeStorage';
import type { Type } from '../utils/TypeStorage';
import { TypePropType } from '../utils/TypeStorage';

export type EntitySet = {
  id:string,
  permission:Permission,
  type:Type,
  name:string,
  title:string,
  description:string,
  propertyTypes:PropertyType[]
};

export const EntitySetPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  permission: PropTypes.instanceOf(Permission),
  type: TypePropType.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  propertyTypes: PropTypes.arrayOf(PropertyTypePropType)
});

export const EntitySetNschema = new schema.Entity('entitySets', {
  propertyTypes: [PropertyTypeNschema]
});
