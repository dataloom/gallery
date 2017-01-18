import { combineEpics } from 'redux-observable';
import CatalogEpic from '../../containers/catalog/CatalogEpic';
import EntitySetDetailEpic from '../../containers/entitysetdetail/EntitySetDetailEpic';

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic,
    EntitySetDetailEpic
  );
}
