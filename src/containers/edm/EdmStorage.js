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


/**
 * A reference to an object in the normalized data
 */
export type EdmObjectReference = {
  id:string,
  collection:string
}
function referenceToString(reference:EdmObjectReference) {
  return `{id: '${reference.id}, collection: ${reference.collection}}`;
}

/* Utility Functions */
const SCHEMA_BY_COLLECTION = Object.freeze({
  [COLLECTIONS.PROPERTY_TYPE]: PropertyTypeNschema,
  [COLLECTIONS.ENTITY_TYPE]: EntityTypeNschema,
  [COLLECTIONS.ENTITY_SET]: EntitySetNschema
});

/**
 *
 * @param normalizedData
 * @param references all references must refer to objects in the same collection
 * @return {any}
 */
export function getEdmObjects(normalizedData:Object, references:EdmObjectReference[]) {
  if (references.length == 0) {
    return [];
  }

  const collection = references[0].collection;
  if (!references.every(reference => reference.collection === collection)) {
    throw new Error(`Not all references are from collection "${collection}"`);
  }

  if (!(collection in SCHEMA_BY_COLLECTION)) {
    throw new Error(`"${collection}" is not a valid collection`);
  }
  const schema = SCHEMA_BY_COLLECTION[collection];

  return denormalize(normalizedData, schema, references.map(reference => reference.id));
}

/**
 *
 * @param normalizedData
 * @param references references can be from any collection
 * @return {*}
 */
export function getEdmObjectsShallow(normalizedData:Object, references:EdmObjectReference[]) {
  if (references.length == 0) {
    return [];
  }

  return references.map(reference => {
    const collection = normalizedData[reference.collection];
    if (reference.id in collection) {
      return collection[reference.id];
    } else {
      throw new Error(`Invalid reference: ${referenceToString(reference)}`);
    }
  });
}