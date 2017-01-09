import { Permission } from '../../core/permissions/Permission';

export const INITIAL_STATE = {
  entitySets: [
    {
      "key": "asdf",
      "name": "Employees",
      "title": "The entity set title",
      "type": {
        "name": "employee",
        "namespace": "testcsv"
      },
      "properties": [{
        "title": "Prop1",
        "description": "Blah blah blah",
        "permission": Permission.OWNER
      }],
      "permission": Permission.OWNER
  }]
};

export function reducer(state = INITIAL_STATE, action) {
  return state
}