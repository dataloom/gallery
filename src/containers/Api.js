/* @flow */
// TODO: Remove once loom-data-js upgrades

import Axios from 'axios';

let axiosInstance;

export function configure(baseURL:string, authToken) {
  axiosInstance = Axios.create({
    baseURL,
    headers: {
      common: {
        'Authorization': `Bearer ${authToken}`,
      }
    }
  });
}

export type EdmQueryParam = {
  id:string,
  type:string,
  include:string[]
}

export function edmQuery(queryParams :EdmQueryParam[]) {
  return axiosInstance.post('/datastore/edm', queryParams)
    .then(response => response.data);
}

export function permissionsRequest(requests) {
  return axiosInstance.put('/datastore/requests', requests)
    .then(response => response.data);
}

export function getStatus(reqStatus, aclKeys) {
  return axiosInstance.post(`/datastore/requests/${reqStatus}`, aclKeys)
    .then(response => response.data);
}