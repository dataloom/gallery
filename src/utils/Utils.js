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

  static loadUnusedPairs(allProps, properties) {
    if (allProps === undefined || properties === undefined) return {};
    const propMap = {};
    properties.forEach((prop) => {
      if (!propMap[prop.namespace] || propMap[prop.namespace] === undefined) propMap[prop.namespace] = [prop.name];
      else {
        const newList = propMap[prop.namespace];
        newList.push(prop.name);
        propMap[prop.namespace] = newList;
      }
    });

    const resultMap = {};
    Object.keys(allProps).forEach((namespace) => {
      if (!propMap[namespace] || propMap[namespace] === undefined) resultMap[namespace] = allProps[namespace];
      else {
        const resultList = allProps[namespace].filter((name) => {
          return !propMap[namespace].includes(name);
        });
        resultMap[namespace] = resultList;
      }
    });
    return resultMap;
  }

  static getAllEdmPrimitiveTypes() {
    return [
      { value: 'Binary', label: 'Binary' },
      { value: 'Boolean', label: 'Boolean' },
      { value: 'Byte', label: 'Byte' },
      { value: 'SByte', label: 'SByte' },
      { value: 'Date', label: 'Date' },
      { value: 'DateTimeOffset', label: 'DateTimeOffset' },
      { value: 'TimeOfDay', label: 'TimeOfDay' },
      { value: 'Duration', label: 'Duration' },
      { value: 'Decimal', label: 'Decimal' },
      { value: 'Single', label: 'Single' },
      { value: 'Double', label: 'Double' },
      { value: 'Guid', label: 'Guid' },
      { value: 'Int16', label: 'Int16' },
      { value: 'Int32', label: 'Int32' },
      { value: 'Int64', label: 'Int64' },
      { value: 'String', label: 'String' },
      { value: 'Stream', label: 'Stream' },
      { value: 'Geography', label: 'Geography' },
      { value: 'GeographyPoint', label: 'GeographyPoint' },
      { value: 'GeographyLineString', label: 'GeographyLineString' },
      { value: 'GeographyPolygon', label: 'GeographyPolygon' },
      { value: 'GeographyMultiPoint', label: 'GeographyMultiPoint' },
      { value: 'GeographyMultiLineString', label: 'GeographyMultiLineString' },
      { value: 'GeographyMultiPolygon', label: 'GeographyMultiPolygon' },
      { value: 'GeographyCollection', label: 'GeographyCollection' },
      { value: 'Geometry', label: 'Geometry' },
      { value: 'GeometryPoint', label: 'GeometryPoint' },
      { value: 'GeometryLineString', label: 'GeometryLineString' },
      { value: 'GeometryPolygon', label: 'GeometryPolygon' },
      { value: 'GeometryMultiPoint', label: 'GeometryMultiPoint' },
      { value: 'GeometryMultiLineString', label: 'GeometryMultiLineString' },
      { value: 'GeometryMultiPolygon', label: 'GeometryMultiPolygon' },
      { value: 'GeometryCollection', label: 'GeometryCollection' }
    ];
  }
}
