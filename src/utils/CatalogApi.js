import FileSaver from 'file-saver';
import axios from 'axios';
import Consts from './AppConsts';
import EnvironmentService from './EnvironmentService';

export default class CatalogApi {

  static getCatalogSchemaData() {
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.SCHEMAS);
    return axios.get(url).then(response => response.data);
  }

  static getCatalogEntityTypeData() {
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.ENTITY_TYPE);
    return axios.get(url).then(response => response.data);
  }

  static getCatalogEntitySetData() {
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.ENTITY_SET);
    return axios.get(url).then(response => response.data);
  }

  static getDownloadRequestBody(data, method, datatype, url) {
    const type = (datatype === Consts.JSON) ? 'application/json' : 'text/csv';
    const req = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (method === Consts.PUT) {
      req.data = data;
    }
    if (datatype === Consts.CSV) {
      req.headers.Accept = type;
    }
    return req;
  }

  static saveFile(entityData, name, datatype, success) {
    const type = (datatype === Consts.JSON) ? 'application/json' : 'text/csv';
    const dataString = JSON.stringify(entityData);
    const blob = new Blob([dataString], { type });
    FileSaver.saveAs(blob, name.concat(
      (datatype === Consts.JSON) ? '.json' : '.csv'
    ));
    success(datatype);
  }

  static downloadSchema(data, name, datatype, success) {
    this.saveFile(data, name, datatype, success);
  }

  static downloadEntityType(namespace, name, datatype, err, success) {
    const data = JSON.stringify({
      namespace,
      name
    });
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.ENTITY_TYPE_DATA_URL);
    return axios(this.getDownloadRequestBody(data, Consts.PUT, datatype, url)
      ).then((resp) => {
        this.saveFile(resp.data, name, datatype, success);
      }).catch(() => {
        err(datatype);
      });
  }

  static downloadEntitySet(name, typename, datatype, err, success) {
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.ENTITY_SET_DATA_BASE_URL)
      .concat('/')
      .concat(name)
      .concat('/')
      .concat(typename)
      .concat(Consts.ENTITYDATA);
    return axios(this.getDownloadRequestBody(null, Consts.GET, datatype, url)
      ).then((resp) => {
        this.saveFile(resp.data, name, datatype, success);
      }).catch(() => {
        err(datatype);
      }
    );
  }

  static addEntityTypeToSchema(namespace, name, fqnSet, success, err) {
    const url = EnvironmentService.getDatastoreUrl()
      .concat(Consts.SCHEMAS)
      .concat('/')
      .concat(namespace)
      .concat('/')
      .concat(name);
    return axios({
      method: 'PUT',
      url,
      data: JSON.stringify(fqnSet),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => success()
    ).catch(() => err());
  }

  // TODO
  static addPropertyToEntityType(namespace, name, fqnSet, success, err) {
    console.log('adding property to entity type....');
    // const url = EnvironmentService.getDatastoreUrl()
    //   .concat(Consts.SCHEMAS)
    //   .concat('/')
    //   .concat(namespace)
    //   .concat('/')
    //   .concat(name);
    // return axios({
    //   method: 'PUT',
    //   url,
    //   data: JSON.stringify(fqnSet),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).then(() => success()
    // ).catch(() => err());
  }

  static deleteTypeFromSchema(schemaNamespace, schemaName, fqnSet, success) {
    const url = EnvironmentService.getDatastoreUrl()
      .concat(Consts.SCHEMAS)
      .concat('/')
      .concat(schemaNamespace)
      .concat('/')
      .concat(schemaName);
    return axios({
      method: 'DELETE',
      url,
      data: JSON.stringify(fqnSet),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => success());
  }

  // TODO
  static deletePropFromType(namespace, name, fqnSet, success) {
    console.log('deleting prop from type.....');
    const url = EnvironmentService.getDatastoreUrl()
      .concat(Consts.SCHEMAS)
      .concat('/')
      .concat(namespace)
      .concat('/')
      .concat(name);
    return axios({
      method: 'DELETE',
      url,
      data: JSON.stringify(fqnSet),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => success());
  }

  static createNewSchema(name, namespace, success, err) {
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.SCHEMAS);
    return axios({
      method: 'PUT',
      url,
      data: JSON.stringify({ namespace, name }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => success())
    .catch(() => err());
  }

  static createNewEntityType(name, namespace, success, err) {
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.ENTITY_TYPE);
    return axios({
      method: 'PUT',
      url,
      data: JSON.stringify({
        namespace,
        name,
        properties: [],
        key: []
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => success())
    .catch(() => err());
  }

  // TODO
  static deletePropFromSchema(name, namespace, success, err) {
    console.log('deleting...');
  }

  // TODO
  static addPropertyToSchema(namespace, name, fqnSet, success, err) {
  //   const url = EnvironmentService.getDatastoreUrl()
  //     .concat(Consts.SCHEMAS)
  //     .concat('/')
  //     .concat(namespace)
  //     .concat('/')
  //     .concat(name);
  //   return axios({
  //     method: 'PUT',
  //     url,
  //     data: JSON.stringify(fqnSet),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).then(() => success()
  //   ).catch(() => err());
    console.log('adding property to schema...');
  }
}
