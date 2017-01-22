import { PropTypes } from 'react';

export const TypePropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired
});

export const PropertyTypePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: TypePropType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  datatype: PropTypes.string
});

export const EntityTypePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(PropertyTypePropType),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: TypePropType.isRequired,
});

export const EntitySetPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: TypePropType.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  entityType: EntityTypePropType
});