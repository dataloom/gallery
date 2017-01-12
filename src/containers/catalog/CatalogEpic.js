/* @flow */
import { combineEpics } from 'redux-observable';
import { normalize } from 'normalizr';
import Immutable from 'immutable';

import * as actionTypes from './CatalogActionTypes';
import * as actionFactories from './CatalogActionFactories';
import * as ndataActionFactories from '../ndata/NdataActionFactories';
import { Permission } from '../../core/permissions/Permission';
import { EntitySet, EntitySetNschema } from '../../components/entityset/EntitySetStorage';

const EXAMPLE_SEARCH_RESPONSE = [{
  "acls": [
    "READ",
    "OWNER",
    "DISCOVER",
    "LINK",
    "WRITE"
  ],
  "entitySet": {
    "description": "This is a description for the entity set called employees.",
    "entityTypeId": "c271a300-ea05-420b-b33b-8ecb18de5ce7",
    "id": "0a648f39-5e41-46b5-a928-ec44cdeeae13",
    "name": "Employees",
    "title": "The Entity Set Title",
    "type": {
      "fullQualifiedNameAsString": "testcsv.employee",
      "name": "employee",
      "namespace": "testcsv"
    }
  },
  "propertyTypes": [
    {
      "datatype": "String",
      "description": "id of the employee",
      "id": "033fef2a-8f34-4bcd-b1ad-e123c462561d",
      "schemas": [],
      "title": "Employee Id",
      "type": {
        "fullQualifiedNameAsString": "testcsv.employee_id",
        "name": "employee_id",
        "namespace": "testcsv"
      }
    },
    {
      "datatype": "String",
      "description": "name of the employee",
      "id": "e76bc4e4-cf6a-43f4-a338-d241ded39093",
      "schemas": [],
      "title": "Employee Name",
      "type": {
        "fullQualifiedNameAsString": "testcsv.employee_name",
        "name": "employee_name",
        "namespace": "testcsv"
      }
    },
    {
      "datatype": "String",
      "description": "title of the employee",
      "id": "9727370f-8506-402c-8f35-2da4dbbb3c06",
      "schemas": [],
      "title": "Employee Title",
      "type": {
        "fullQualifiedNameAsString": "testcsv.employee_title",
        "name": "employee_title",
        "namespace": "testcsv"
      }
    },
    {
      "datatype": "String",
      "description": "salary of the employee",
      "id": "eb15c62d-fe91-4231-abb7-1228759cae43",
      "schemas": [],
      "title": "Employee Salary",
      "type": {
        "fullQualifiedNameAsString": "testcsv.salary",
        "name": "salary",
        "namespace": "testcsv"
      }
    },
    {
      "datatype": "String",
      "description": "department of the employee",
      "id": "0bae0920-2b89-4da0-8af9-8079a52d9e98",
      "schemas": [],
      "title": "Employee Department",
      "type": {
        "fullQualifiedNameAsString": "testcsv.employee_dept",
        "name": "employee_dept",
        "namespace": "testcsv"
      }
    }
  ]
}];

function filterEpic(action$) {
  return action$.ofType(actionTypes.CATALOG_UPDATE_FILTER)
    .forEach(action => console.log(action.filterParams))
}

function convertSearchResult(rawResult): EntitySet {
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

// TODO: Cancellation and Error handling
function searchCatalogEpic(action$) {
  return action$.ofType(actionTypes.CATALOG_SEARCH_REQUEST)
  // .delay(2000)
    // Run search
    .mapTo(EXAMPLE_SEARCH_RESPONSE)
    .map(rawResult => rawResult.map(convertSearchResult))
    .map(result => normalize(result, [EntitySetNschema]))
    .map(Immutable.fromJS)
    .map(normalizedData => {
      let propertyTypes = normalizedData.getIn(['entities', 'propertyTypes']);
      let permissions = loadPermissions(propertyTypes.keySeq());
      return normalizedData.mergeDeepIn(['entities', 'propertyTypes'], permissions);
    })
    .flatMap(normalizedData => [
      ndataActionFactories.updateNormalizedData(normalizedData.get('entities')),
      actionFactories.catalogSearchResolve(normalizedData.get('result'))
    ])
}

export default combineEpics(filterEpic, searchCatalogEpic);