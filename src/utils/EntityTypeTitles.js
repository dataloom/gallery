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
  ],
  'sample.person2': [
    'general.lastname',
    'general.firstname'
  ],
  'sample.bookings2': [
    'publicsafety.datebooked2'
  ]
};

function getFqn(edmObj) {
  return `${edmObj.type.namespace}.${edmObj.type.name}`;
}

function getFormattedRow(row, propertyTypes) {
  if (Object.keys(row)[0].includes('.')) return row;
  const convertedRow = {};
  propertyTypes.forEach((propertyType) => {
    if (row[propertyType.id]) convertedRow[getFqn(propertyType)] = row[propertyType.id];
  });
  return convertedRow;
}

export default function getTitle(entityType, row, propertyTypes) {
  const formattedRow = getFormattedRow(row, propertyTypes);
  const titleValues = titleProperties[getFqn(entityType)].map((propertyTypeFqn) => {
    return formattedRow[propertyTypeFqn];
  });
  if (titleValues.length === 0) return `[${entityType.title}]`;
  return titleValues.join(', ');
}
