import { schema } from 'normalizr';

/* Collections */
export const COLLECTIONS = Object.freeze({
  PROPERTY_TYPE: 'propertyTypes',
  ENTITY_TYPE: 'entityTypes',
  ENTITY_SET: 'entitySets'
});

/* Normalizr Schemas */
export const PropertyTypeNschema = new schema.Entity(COLLECTIONS.PROPERTY_TYPE);

export const EntityTypeNschema = new schema.Entity(COLLECTIONS.ENTITY_TYPE, {
  properties: [PropertyTypeNschema]
});

export const EntitySetNschema = new schema.Entity(COLLECTIONS.ENTITY_SET, {
  entityType: EntityTypeNschema
});


