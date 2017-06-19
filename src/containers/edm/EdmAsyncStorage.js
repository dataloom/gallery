/*
 * @flow
 */

import { createReference } from '../async/AsyncStorage';

export const COLLECTIONS = Object.freeze({
  PROPERTY_TYPE: 'propertyTypes',
  ENTITY_TYPE: 'entityTypes',
  ENTITY_SET: 'entitySets'
});

export function createEntityTypeAsyncReference(id :string) {
  return createReference(COLLECTIONS.ENTITY_TYPE, id);
}
