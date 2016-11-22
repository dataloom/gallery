import FileSaver from 'file-saver';
import FileConsts from './Consts/FileConsts';

export default class FileService {

  static saveFile(entityData, name, datatype, success) {
    let contentType = 'application/json';
    let data = entityData;

    if (datatype === FileConsts.JSON) {
      contentType = 'text/csv';
      data = JSON.stringify(entityData);
    }

    const blob = new Blob([data], {
      type: contentType
    });

    FileSaver.saveAs(blob, name.concat(
      (datatype === FileConsts.JSON) ? '.json' : '.csv'
    ));
    success(datatype);
  }
}
