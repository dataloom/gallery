import { combineEpics } from 'redux-observable';
import CatalogEpic from '../../containers/catalog/CatalogEpic';
import EdmEpic from '../../containers/edm/EdmEpic';
import CreateEntitySetEpic from '../../containers/entitysetforms/CreateEntitySetEpic';

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic,
    EdmEpic,
    CreateEntitySetEpic
  );
}
