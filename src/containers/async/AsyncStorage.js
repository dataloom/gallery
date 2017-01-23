/* @flow */
import { PropTypes } from 'react';
import { Map } from 'immutable';

export type AsyncReference = {
  namespace: string,
  id :string
};

export const AsyncReferencePropType = PropTypes.shape({
  namespace: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
});

export function referenceOrObjectPropType(objectPropType) {
  return PropTypes.oneOfType([PropTypes.instanceOf(AsyncReferencePropType), PropTypes.instanceOf(objectPropType)]);
}

/* Statuses */
export const STATUS = Object.freeze({
  EMPTY_REFERENCE: Symbol('empty reference'),
  LOADING: Symbol('loading'),
  NOT_FOUND: Symbol('404'),
  ACCESS_DENIED: Symbol('403'),
});

/* Helper Functions */
function getReferencePath(reference :AsyncReference) {
  return [reference.namespace, reference.id];
}

export function resolveReference(asyncContent :Map<string, any>, reference :AsyncReference): any[] {
  if (!asyncContent) {
    throw new Error('"asyncContent" can\'t be null');
  }
  if (!reference) {
    throw new Error('"reference" can\'t be null');
  }

  const path = getReferencePath(reference);

  if (!asyncContent.hasIn(path)) {
    return STATUS.EMPTY_REFERENCE
  }

  return asyncContent.getIn(path);
}

export function resolveReferences(asyncContent :Map<string, any>, references :AsyncReference[]) :any[] {
  return references.map(reference => resolveReference(asyncContent, reference));
}