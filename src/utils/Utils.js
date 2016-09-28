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
}
