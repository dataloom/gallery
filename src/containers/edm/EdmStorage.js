import { schema, denormalize } from 'normalizr';

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

/*
** Utility Functions
*/
const SCHEMA_BY_COLLECTION = Object.freeze({
  [COLLECTIONS.PROPERTY_TYPE]: PropertyTypeNschema,
  [COLLECTIONS.ENTITY_TYPE]: EntityTypeNschema,
  [COLLECTIONS.ENTITY_SET]: EntitySetNschema
});


/**
 *
 * @param immutableNormalizedData in immutable format
 */
export function getReferencesFromNormalizedData(immutableNormalizedData):EdmObjectReference[] {
  return immutableNormalizedData.reduce((references, idMap, collectionName) => {
    const currentRefs = idMap.keySeq().toArray().map((id) => {
      return {
        id,
        collection: collectionName
      }
    });
    // TODO: Modify references array directly
    return references.concat(currentRefs);
  }, []);
}

/**
 *
 * @param normalizedData
 * @param reference
 * @return {any}
 */
export function getEdmObject(normalizedData:Object, reference:EdmObjectReference) {
  if (!reference) {
    throw new Error('"reference" can\'t be null');
  }
  if (!normalizedData) {
    throw new Error('"normalizedData" can\'t be null');
  }

  const collection = normalizedData[reference.collection];
  if (reference.id in collection) {
    return denormalize(reference.id, SCHEMA_BY_COLLECTION[reference.collection], normalizedData);
  } else {
    throw new Error(`Invalid reference: ${referenceToString(reference)}`);
  }
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