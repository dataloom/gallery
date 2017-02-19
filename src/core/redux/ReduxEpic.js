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

import OrganizationEpic from '../../containers/organizations/epics/OrganizationEpic';
import OrganizationsEpic from '../../containers/organizations/epics/OrganizationsEpic';
import PrincipalsEpic from '../../containers/principals/PrincipalsEpic';

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic,
    CreateEntitySetEpic,
    EdmEpic,
    PermissionsEpic,
    PrincipalsEpic,

    OrganizationEpic,
    OrganizationsEpic
  );
}
