import FileSaver from 'file-saver';
import Consts from './AppConsts';

export default class FileService {

  static saveFile(entityData, name, datatype, success) {
    let contentType = 'application/json';
    let data = entityData;

    if (datatype === Consts.JSON) {
      contentType = 'text/csv';
      data = JSON.stringify(entityData);
    }

    const blob = new Blob([data], {
      type: contentType
    });

    FileSaver.saveAs(blob, name.concat(
      (datatype === Consts.JSON) ? '.json' : '.csv'
    ));
    success(datatype);
  }
}
