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

export function edmQuery(queryParams) {
  return axiosInstance.post('/datastore/edm', queryParams)
    .then(response => response.data);
}