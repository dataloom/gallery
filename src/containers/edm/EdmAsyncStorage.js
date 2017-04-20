import { createReference } from '../async/AsyncStorage';
import { COLLECTIONS } from './EdmStorage';

export function createEntityTypeAsyncReference(id :string) {
  return createReference(COLLECTIONS.ENTITY_TYPE, id);
}
