export default class Utils {

  static addKeysToArray(oldArray) {
    const newArray = [];
    oldArray.forEach((item) => {
      const newItem = item;
      if (item.key !== undefined) {
        newItem.primaryKey = item.key;
      }
      newItem.key = oldArray.indexOf(item);
      newArray.push(newItem);
    });
    return newArray;
  }

  static getAllEdmPrimitiveTypes() {
    return [
      'Binary',
      'Boolean',
      'Byte',
      'SByte',
      'Date',
      'DateTimeOffset',
      'TimeOfDay',
      'Duration',
      'Decimal',
      'Single',
      'Double',
      'Guid',
      'Int16',
      'Int32',
      'Int64',
      'String',
      'Stream',
      'Geography',
      'GeographyPoint',
      'GeographyLineString',
      'GeographyPolygon',
      'GeographyMultiPoint',
      'GeographyMultiLineString',
      'GeographyMultiPolygon',
      'GeographyCollection',
      'Geometry',
      'GeometryPoint',
      'GeometryLineString',
      'GeometryPolygon',
      'GeometryMultiPoint',
      'GeometryMultiLineString',
      'GeometryMultiPolygon',
      'GeometryCollection'
    ];
  }
}
