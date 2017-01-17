/* @flow */
import { normalize } from 'normalizr';
import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';

import * as actionTypes from './EntitySetDetailActionTypes';
import * as actionFactories from './EntitySetDetailActionFactories';
import * as ndataActionFactories from '../ndata/NdataActionFactories';
import { Permission } from '../../core/permissions/Permission';
import type { EntitySet } from '../../components/entityset/EntitySetStorage';
import { EntitySetNschema } from '../../components/entityset/EntitySetStorage';

const EXAMPLE_DETAIL_RESPONSE = {
  'acls': [
    'READ',
    'OWNER',
    'DISCOVER',
    'LINK',
    'WRITE'
  ],
  'entitySet': {
    'description': 'This is a description for the entity set called employees.',
    'entityTypeId': 'c271a300-ea05-420b-b33b-8ecb18de5ce7',
    'id': '0a648f39-5e41-46b5-a928-ec44cdeeae13',
    'name': 'Employees',
    'title': 'The Entity Set Title',
    'type': {
      'fullQualifiedNameAsString': 'testcsv.employee',
      'name': 'employee',
      'namespace': 'testcsv'
    }
  },
  'propertyTypes': [
    {
      'datatype': 'String',
      'description': 'id of the employee',
      'id': '033fef2a-8f34-4bcd-b1ad-e123c462561d',
      'schemas': [],
      'title': 'Employee Id',
      'type': {
        'fullQualifiedNameAsString': 'testcsv.employee_id',
        'name': 'employee_id',
        'namespace': 'testcsv'
      }
    },
    {
      'datatype': 'String',
      'description': 'name of the employee',
      'id': 'e76bc4e4-cf6a-43f4-a338-d241ded39093',
      'schemas': [],
      'title': 'Employee Name',
      'type': {
        'fullQualifiedNameAsString': 'testcsv.employee_name',
        'name': 'employee_name',
        'namespace': 'testcsv'
      }
    },
    {
      'datatype': 'String',
      'description': 'title of the employee',
      'id': '9727370f-8506-402c-8f35-2da4dbbb3c06',
      'schemas': [],
      'title': 'Employee Title',
      'type': {
        'fullQualifiedNameAsString': 'testcsv.employee_title',
        'name': 'employee_title',
        'namespace': 'testcsv'
      }
    },
    {
      'datatype': 'String',
      'description': 'salary of the employee',
      'id': 'eb15c62d-fe91-4231-abb7-1228759cae43',
      'schemas': [],
      'title': 'Employee Salary',
      'type': {
        'fullQualifiedNameAsString': 'testcsv.salary',
        'name': 'salary',
        'namespace': 'testcsv'
      }
    },
    {
      'datatype': 'String',
      'description': 'department of the employee',
      'id': '0bae0920-2b89-4da0-8af9-8079a52d9e98',
      'schemas': [],
      'title': 'Employee Department',
      'type': {
        'fullQualifiedNameAsString': 'testcsv.employee_dept',
        'name': 'employee_dept',
        'namespace': 'testcsv'
      }
    }
  ]
};

function converDetailResponse(rawResult): EntitySet {
  let permission = rawResult.acls.map(Permission.enumValueOf).reduce(Permission.maxPermission);
  return Object.assign({}, rawResult.entitySet, {
    permission,
    propertyTypes: rawResult.propertyTypes
  });
}

function loadPermissions(ids) {
  let permissionMap = {};
  ids.forEach(id => {
    permissionMap[id] = {
      permission: Permission.OWNER
    }
  });
  return permissionMap;
}

/* Worflow:
  - Filter on action
  - Get Id or IdList
  - Pull available from cache
  - Query for remainder
    - Lift for multiple requests
    - Send results to ndata
  - Send Id(s) or Error
 */

// TODO: Cancellation and Error handling
function loadEntitySetDetailEpic(action$, store) {
  // Filter on Action
  return action$.ofType(actionTypes.ENTITY_SET_REQUEST)
    // Get Id(s)
    .map(action => action.id)
    // Pull available from cache
    .mergeMap(id => {
      const state = store.getState();
      const hasId = state.hasIn(['normalizedData', 'entitySets', id]);
      if (hasId) {
        return Observable.of(id)
          .map(actionFactories.entitySetDetailResolve);
      } else {
        return Observable.of(EXAMPLE_DETAIL_RESPONSE)
          .map(converDetailResponse)
          .map(result => normalize(result, EntitySetNschema))
          .map(Immutable.fromJS)
          .map(normalizedData => {
            const propertyTypes = normalizedData.getIn(['entities', 'propertyTypes']);
            const permissions = loadPermissions(propertyTypes.keySeq());
            return normalizedData.mergeDeepIn(['entities', 'propertyTypes'], permissions);
          })
          .flatMap(normalizedData => [
            ndataActionFactories.updateNormalizedData(normalizedData.get('entities')),
            actionFactories.entitySetDetailResolve(normalizedData.get('result'))
          ]);
      }
    });
}

export default loadEntitySetDetailEpic;