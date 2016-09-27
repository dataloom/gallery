import $ from 'jquery';
import FileSaver from 'file-saver';
import Consts from './AppConsts';

export default class CatalogApi {

  static getCatalogSchemaData() {
    return $.get(Consts.SCHEMA_BASE_PATH, (result) => {
      return result;
    });
  }

  static getCatalogEntityTypeData() {
    return $.get(Consts.ENTITY_TYPES_BASE_PATH, (result) => {
      return result;
    });
  }

  static getCatalogEntitySetData() {
    return $.get(Consts.ENTITY_SETS_BASE_PATH, (result) => {
      return result;
    });
  }

  static getDownloadRequestBody(data, datatype, url, name) {
    const type = (datatype === Consts.JSON) ? 'application/json' : 'text/csv';
    const req = {
      url: url,
      type: 'PUT',
      contentType: 'application/json',
      data: data,
      success: (data) => {
        const dataString = JSON.stringify(data);
        const blob = new Blob([dataString], { type: type });
        FileSaver.saveAs(blob, name.concat(
          (datatype === Consts.JSON) ? '.json' : '.csv'
        ));
      },
      error: (e) => {
        console.error(e);
      }
    };
    if (datatype === Consts.CSV) {
      req.headers = {
        Accept: type
      };
    }
    return req;
  }

  static downloadSchema(name, datatype, entityTypeFqns) {
    return $.ajax(this.getDownloadRequestBody(entityTypeFqns, datatype, Consts.SCHEMA_DATA_URL, name));
  }

  static downloadEntityType(namespace, name, datatype) {
    const data = JSON.stringify({
      namespace: namespace,
      name: name
    });
    return $.ajax(this.getDownloadRequestBody(data, datatype, Consts.ENTITY_TYPE_DATA_URL, name));
  }

  static downloadEntitySetJson() {
    return null;
  }
}
