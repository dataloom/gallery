import axios from 'axios';

const BASE_URL = 'http://localhost:8080/ontology/data/entitydata';

export default class VisualizationApi {

  static getVisualizationData(typeNamespace, typeName, name, propertyTypes, auth) {
    const authHeader = {
      headers: {
        Authorization: `Bearer ${auth.getToken()}`
      }
    };
    const url = `${BASE_URL}/${typeNamespace}/${typeName}/${name}/selected`;
    return axios.put(url, propertyTypes, authHeader)
    .then((response) => {
      return JSON.parse(response.data);
    });
  }
}
