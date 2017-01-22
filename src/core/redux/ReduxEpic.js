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
import * as OrganizationsEpic from '../../containers/organizations/epics/OrganizationsEpic';

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic,
    CreateEntitySetEpic,
    EdmEpic,
    PermissionsEpic,

    CreateOrganizationEpic,
    OrganizationsEpic.fetchOrgsEpic,
    OrganizationsEpic.addRoleToOrgEpic,
    OrganizationsEpic.removeRoleFromOrgEpic
  );
}
