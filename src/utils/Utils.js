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
    if (allProps === undefined || properties === undefined) {
      return {};
    }
    const propMap = {};
    properties.forEach((prop) => {
      if (!propMap[prop.namespace] || propMap[prop.namespace] === undefined) {
        propMap[prop.namespace] = [prop.name];
      }
      else {
        const newList = propMap[prop.namespace];
        newList.push(prop.name);
        propMap[prop.namespace] = newList;
      }
    });

    const resultMap = {};
    Object.keys(allProps).forEach((namespace) => {
      if (!propMap[namespace] || propMap[namespace] === undefined) {
        resultMap[namespace] = allProps[namespace];
      }
      else {
        const resultList = allProps[namespace].filter((name) => {
          return !propMap[namespace].includes(name);
        });
        resultMap[namespace] = resultList;
      }
    });
    return resultMap;
  }

  static getFqnObj(namespace, name) {
    return { namespace, name };
  }
}
