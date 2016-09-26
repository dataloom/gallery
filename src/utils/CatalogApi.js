import $ from 'jquery';
import Consts from './AppConsts';

export default class CatalogApi {

  static getCatalogSchemaData() {
    return $.get(Consts.SCHEMA_BASE_PATH, (result) => {
      return result;
    });
  }

  static getCatalogEntityTypeData() {
    return null;
  }

  static getCatalogEntitySetData() {
    return $.get(Consts.ENTITY_SETS_BASE_PATH, (result) => {
      return result;
    });
  }

  static downloadSchemaJson(namespace, name) {
    console.log('hi from the api');
    console.log(namespace);
    console.log(name);
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

  static downloadEntityTypeJson() {
    return null;
  }

  static downloadEntitySetJson() {
    return null;
  }
}
