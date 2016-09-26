export default class Utils {

  static getFqn(namespace, name) {
    return (namespace.concat('.').concat(name));
  }

  static addKeysToArray(oldArray) {
    const newArray = [];
    oldArray.forEach((item) => {
      const newItem = item;
      newArray.key = oldArray.indexOf(item);
      newArray.push(newItem);
    });
    return newArray;
  }
}
