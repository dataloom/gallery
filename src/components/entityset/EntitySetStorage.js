/* @flow */
import { schema } from 'normalizr';
import { PropTypes } from 'react';
import { Permission } from '../../core/permissions/Permission';

/* Type */
export type Type = {
  name: string,
  namespace: string
};

export const TypePropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired
});

/* PropertyType */
export type PropertyType = {
  id: string,
  permission: Permission,
  type: Type,
  title: string,
  description: string,
  datatype: string,
};

export const PropertyTypePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  permission: PropTypes.instanceOf(Permission),
  type: TypePropType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  datatype: PropTypes.string.isRequired,
});

export const PropertyTypeNschema = new schema.Entity('propertyTypes');

/* EntitySet */
export type EntitySet = {
  id: string,
  permission: Permission,
  type: Type,
  name: string,
  title: string,
  description: string,
  propertyTypes: PropertyType[]
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
