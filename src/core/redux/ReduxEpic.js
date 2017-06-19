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
// import EntitySetDetailEpic from '../../containers/entitysetdetail/EntitySetDetailEpic';
import OrganizationEpic from '../../containers/organizations/epics/OrganizationEpic';
import OrganizationsEpic from '../../containers/organizations/epics/OrganizationsEpic';
import PermissionsEpic from '../../containers/permissions/PermissionsEpic';
import PermissionsSummaryEpic from '../../containers/permissionssummary/PermissionsSummaryEpic';
import PrincipalsEpic from '../../containers/principals/PrincipalsEpic';
import VisualizationEpic from '../../containers/visualizations/VisualizationEpic';
import TopUtilizersEpic from '../../containers/toputilizers/TopUtilizersEpic';

// import NeuronEpic from '../neuron/NeuronEpic'; // just for now

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic,
    CreateEntitySetEpic,
    DatasetsEpic,
    EdmEpic,
    // EntitySetDetailEpic,
    // NeuronEpic, // just for now
    PermissionsEpic,
    PermissionsSummaryEpic,
    PrincipalsEpic,
    OrganizationEpic,
    OrganizationsEpic,
    TopUtilizersEpic,
    VisualizationEpic
  );
}
