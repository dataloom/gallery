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

  static downloadSchemaJson(namespace, name) {
    return $.get(Consts.SCHEMA_BASE_PATH);
    // return $.ajax({
    //   url: Consts.SCHEMA_BASE_PATH,
    //   type: 'POST',
    //   data: JSON.stringify({
    //     namespace: namespace,
    //     name: name
    //   }),
    //   contentType: 'application/json',
    //   success: (schemaData) => {
    //     console.log(schemaData);
    //   },
    //   error: (e) => {
    //     console.error(e);
    //   }
    //   Consts.SCHEMA_BASE_PATH,
    //   {
    //     namespace: namespace,
    //     name: name
    //   }
    // ).done((schemaData) => {
    //   console.log(schemaData);
    // }).fail((e) => {
    //   console.error(e);
    // });
    // });
  }

  static getDownloadRequestBody(namespace, name, datatype, url) {
    const type = (datatype === Consts.JSON) ? 'application/json' : 'text/csv';
    const req = {
      url: url,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        namespace: namespace,
        name: name
      }),
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

  static downloadEntityType(namespace, name, datatype) {
    return $.ajax(this.getDownloadRequestBody(namespace, name, datatype, Consts.ENTITY_TYPE_DATA_URL));
  }

  static downloadEntitySetJson() {
    return null;
  }
}
