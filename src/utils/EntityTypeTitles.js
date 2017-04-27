const titleProperties = {
  'general.person': [
    'general.lastname',
    'general.firstname'
  ],
  'general.location': [
    'general.address'
  ],
  'general.case': [
    'publicsafety.case'
  ]
};

export default class EntityTypeTitles {

  static getFqn(edmObj) {
    return `${edmObj.type.namespace}.${edmObj.type.name}`;
  }

  static getTitleProps(entityType) {
    return titleProperties[this.getFqn(entityType)];
  }

  static getFormattedRow(row, propertyTypes) {
    if (Object.keys(row)[0].includes('.')) return row;
    const convertedRow = {};
    propertyTypes.forEach((propertyType) => {
      if (row[propertyType.id]) convertedRow[this.getFqn(propertyType)] = row[propertyType.id];
    });
    return convertedRow;
  }

  static getTitle(entityType, row, propertyTypes) {
    const formattedRow = this.getFormattedRow(row, propertyTypes);
    const titleValues = titleProperties[this.getFqn(entityType)].map((propertyTypeFqn) => {
      return formattedRow[propertyTypeFqn];
    });
    if (titleValues.length === 0) return `[${entityType.title}]`;
    return titleValues.join(', ');
  }
}
