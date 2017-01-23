/*
 * @flow
 */

import {
  combineEpics
} from 'redux-observable';

import CatalogEpic from '../../containers/catalog/CatalogEpic';
import CreateEntitySetEpic from '../../containers/entitysetforms/CreateEntitySetEpic';
import EdmEpic from '../../containers/edm/EdmEpic';
import PermissionsEpic from '../../containers/permissions/PermissionsEpic';

import CreateOrganizationEpic from '../../containers/organizations/epics/CreateOrganizationEpic';
import OrganizationsEpic from '../../containers/organizations/epics/OrganizationsEpic';
import UsersEpic from '../../containers/organizations/epics/UsersEpic';

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic,
    CreateEntitySetEpic,
    EdmEpic,
    PermissionsEpic,

    CreateOrganizationEpic,
    OrganizationsEpic,
    UsersEpic
  );
}
