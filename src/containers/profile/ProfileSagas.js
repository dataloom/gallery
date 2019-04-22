import { PrincipalsApi } from 'lattice';

import {
  all,
  call,
  put,
  takeEvery
} from 'redux-saga/effects';

import {
  GET_DB_ACCESS_CREDENTIAL,
  getDbAccessCredential
} from './ProfileActionFactory';


function* getDbAccessCredentialWorker(action :Object) :Generator<*, *, *> {
  try {
    yield put(getDbAccessCredential.request(action.id))

    const dbAccessCredential = yield call(PrincipalsApi.getDbAccessCredential);

    yield put(getDbAccessCredential.success(action.id, dbAccessCredential));
  }
  catch (error) {
    console.error(error);
    yield put(getDbAccessCredential.failure(action.id, error));
  }
  finally {
    yield put(getDbAccessCredential.finally(action.id));
  }
}

export function* getDbAccessCredentialWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_DB_ACCESS_CREDENTIAL, getDbAccessCredentialWorker);
}
