/*
 * @flow
 */

import {
  combineEpics
} from 'redux-observable';

import CatalogEpic from '../../containers/catalog/CatalogEpic';
import CreateEntitySetEpic from '../../containers/entitysetforms/CreateEntitySetEpic';
import DatasetsEpic from '../../containers/datasets/DatasetsEpic';
import EdmEpic from '../../containers/edm/EdmEpic';
import NeuronEpic from '../neuron/NeuronEpic';
import OrganizationEpic from '../../containers/organizations/epics/OrganizationEpic';
import OrganizationsEpic from '../../containers/organizations/epics/OrganizationsEpic';
import PermissionsEpic from '../../containers/permissions/PermissionsEpic';
import PrincipalsEpic from '../../containers/principals/PrincipalsEpic';

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic,
    CreateEntitySetEpic,
    DatasetsEpic,
    EdmEpic,
    NeuronEpic,
    PermissionsEpic,
    PrincipalsEpic,
    OrganizationEpic,
    OrganizationsEpic
  );
}
