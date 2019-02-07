import { EntityDataModelApi } from 'lattice';

import {
  call,
  put,
  takeEvery
} from 'redux-saga/effects';

import {
  LOAD_ENTITY_SET,
  loadEntitySet
} from './EdmActionFactories';


function* loadEntitySetWorker(action :Object) :Generator<*, *, *> {
  try {
    yield put(loadEntitySet.request(action.id))

    const entitySet = yield call(EntityDataModelApi.getEntitySet, action.value);

    yield put(loadEntitySet.success(action.id, entitySet));
  }
  catch (error) {
    console.error(error);
    yield put(loadEntitySet.failure(action.id, error));
  }
  finally {
    yield put(loadEntitySet.finally(action.id));
  }
}

export function* loadEntitySetWatcher() :Generator<*, *, *> {
  yield takeEvery(LOAD_ENTITY_SET, loadEntitySetWorker);
}
