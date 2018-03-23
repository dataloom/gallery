import type { AsyncReference } from '../async/AsyncStorage';

const NAMESPACE = 'principals';
export function createPrincipalReference(id :string) :AsyncReference {
  return {
    id,
    namespace: NAMESPACE
  };
}
