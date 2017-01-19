import { combineEpics } from 'redux-observable';
import CatalogEpic from '../../containers/catalog/CatalogEpic';
import NdataEpic from '../../containers/ndata/NdataEpic';

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic,
    NdataEpic
  );
}
