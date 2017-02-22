import { schema, denormalize } from 'normalizr';

import { AsyncReference } from '../async/AsyncStorage';

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
** Reference Factories
 */
export function createPropertyTypeReference(id:string) {
  if (!id) {
    throw new Error('"id" can\'t be null');
  }
  return {
    id,
    collection: COLLECTIONS.PROPERTY_TYPE
  };
}

export function createEntitySetReference(id:string) {
  if (!id) {
    throw new Error('"id" can\'t be null');
  }
  return {
    id,
    collection: COLLECTIONS.ENTITY_SET
  }
}

export function createEntityTypeReference(id:string) {
  if (!id) {
    throw new Error('"id" can\'t be null');
  }
  return {
    id,
    collection: COLLECTIONS.ENTITY_TYPE
  }
}

export function createAsyncReferenceFromEdmReference(edmReferece :EdmObjectReference) :AsyncReference {
  return {
    id: edmReferece.id,
    namespace: edmReferece.collection
  }
}

/*
 ** Dereferencing
 */
export const BAD_REFERENCE = Symbol('bad reference');

// TODO: Handle both immutable and mutable normalizedData
export function getEdmObjectSilent(normalizedData:Object, reference:EdmObjectReference, badReferenceValue:* = BAD_REFERENCE) {
  if (!reference) {
    throw new Error('"reference" can\'t be null');
  }
  if (!normalizedData) {
    throw new Error('"normalizedData" can\'t be null');
  }

  if (!(reference.collection in normalizedData)) {
    return BAD_REFERENCE;
  }

  const collection = normalizedData[reference.collection];
  if (reference.id in collection) {
    return denormalize(reference.id, SCHEMA_BY_COLLECTION[reference.collection], normalizedData);
  } else {
    return badReferenceValue;
  }
}

export function getEdmObject(normalizedData:Object, reference:EdmObjectReference) {
  const edmObject = getEdmObjectSilent(normalizedData, reference, BAD_REFERENCE);

  if(edmObject === BAD_REFERENCE) {
    throw new Error(`Invalid reference: ${referenceToString(reference)}`);
  } else {
    return edmObject;
  }
}

export function getShallowEdmObjectSilent(normalizedData:Object, reference:EdmObjectReference, badReferenceValue:* = BAD_REFERENCE) {
  if (!reference) {
    throw new Error('"reference" can\'t be null');
  }
  if (!normalizedData) {
    throw new Error('"normalizedData" can\'t be null');
  }

  if (!(reference.collection in normalizedData)) {
    return BAD_REFERENCE;
  }

  const collection = normalizedData[reference.collection];
  if (reference.id in collection) {
    return collection[reference.id];
  } else {
    return badReferenceValue;
  }
}

export function getEdmObjectsShallow(normalizedData:Object, references:EdmObjectReference[]) {
  if (!references) {
    throw new Error('"reference" can\'t be null');
  }
  if (!normalizedData) {
    throw new Error('"normalizedData" can\'t be null');
  }
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
