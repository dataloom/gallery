import { schema } from 'normalizr';

export const PropertyTypeNschema = new schema.Entity('propertyTypes');

export const EntityTypeNschema = new schema.Entity('entityTypes', {
  propertyTypes: [PropertyTypeNschema]
});

export const EntitySetNschema = new schema.Entity('entitySets', {
  entityType: EntityTypeNschema
});


