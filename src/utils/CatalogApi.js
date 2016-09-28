import $ from 'jquery';
import FileSaver from 'file-saver';
import Consts from './AppConsts';

export default class CatalogApi {

  static getCatalogSchemaData() {
    return $.get(Consts.SCHEMA_BASE_PATH);
  }

  static getCatalogEntityTypeData() {
    return $.get(Consts.ENTITY_TYPES_BASE_PATH);
  }

  static getCatalogEntitySetData() {
    return $.get(Consts.ENTITY_SETS_BASE_PATH);
  }

  static getDownloadRequestBody(data, method, datatype, url, name) {
    const type = (datatype === Consts.JSON) ? 'application/json' : 'text/csv';
    const req = {
      url,
      type: method,
      contentType: 'application/json',
      success: (entityData) => {
        const dataString = JSON.stringify(entityData);
        const blob = new Blob([dataString], { type });
        FileSaver.saveAs(blob, name.concat(
          (datatype === Consts.JSON) ? '.json' : '.csv'
        ));
      },
      error: (e) => {
        console.error(e);
      }
    };
    if (method === Consts.PUT) {
      req.data = data;
    }
    if (datatype === Consts.CSV) {
      req.headers = {
        Accept: type
      };
    }
    return req;
  }

  static downloadSchema(name, datatype, entityTypeFqns) {
    return $.ajax(this.getDownloadRequestBody(entityTypeFqns, Consts.PUT, datatype, Consts.SCHEMA_DATA_URL, name));
  }

  static downloadEntityType(namespace, name, datatype) {
    const data = JSON.stringify({
      namespace,
      name
    });
    return $.ajax(this.getDownloadRequestBody(data, Consts.PUT, datatype, Consts.ENTITY_TYPE_DATA_URL, name));
  }

  static downloadEntitySet(name, typename, datatype) {
    const url = Consts.ENTITY_SET_DATA_BASE_URL
      .concat('/')
      .concat(name).concat('/')
      .concat(typename)
      .concat(Consts.ENTITYDATA);
    return $.ajax(this.getDownloadRequestBody(null, Consts.GET, datatype, url, name));
  }
}
