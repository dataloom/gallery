/* @flow */
import { schema } from 'normalizr';
import { PropTypes } from 'react';

import { Permission } from '../../core/permissions/Permission';
import type Type from '../utils/TypeStorage';
import { TypePropType } from '../utils/TypeStorage';

export type PropertyType = {
  id:string,
  permission:Permission,
  type:Type,
  title:string,
  description?:string,
  datatype:string
};

export const PropertyTypePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  permission: PropTypes.instanceOf(Permission),
  type: TypePropType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  datatype: PropTypes.string
});

export const PropertyTypeNschema = new schema.Entity('propertyTypes');