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
import OrganizationsSearchEpic from '../../containers/organizations/epics/OrganizationsSearchEpic';
import PrincipalsEpic from '../../containers/principals/PrincipalsEpic';
import UsersEpic from '../../containers/organizations/epics/UsersEpic';

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic,
    CreateEntitySetEpic,
    EdmEpic,
    PermissionsEpic,
    PrincipalsEpic,

    CreateOrganizationEpic,
    OrganizationsEpic,
    OrganizationsSearchEpic,
    UsersEpic
  );
}
