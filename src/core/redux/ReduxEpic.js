/*
 * @flow
 */

import {
  combineEpics
} from 'redux-observable';

import CatalogEpic from '../../containers/catalog/CatalogEpic';
import CreateEntitySetEpic from '../../containers/entitysetforms/CreateEntitySetEpic';
import CreateOrganizationEpic from '../../containers/organizations/epics/CreateOrganizationEpic';
import EdmEpic from '../../containers/edm/EdmEpic';

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic,
    CreateEntitySetEpic,
    CreateOrganizationEpic,
    EdmEpic
  );
}
