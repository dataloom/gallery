import { combineEpics } from 'redux-observable';
import CatalogEpic from '../../containers/catalog/CatalogEpic';
import EdmEpic from '../../containers/edm/EdmEpic';

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic,
    EdmEpic
  );
}
