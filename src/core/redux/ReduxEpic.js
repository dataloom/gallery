import { combineEpics } from 'redux-observable';
import CatalogEpic from '../../containers/catalog/CatalogEpic';

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic
  );
}