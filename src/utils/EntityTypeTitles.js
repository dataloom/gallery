const titleProperties = {
  // PERSON
  'general.person': [
    'nc.PersonSurName',
    'nc.PersonGivenName'
  ],
  'sample.person2': [
    'general.lastname',
    'general.firstname'
  ],
  'nc.PersonType': [
    'nc.PersonSurName',
    'nc.PersonGivenName'
  ],
  'nc.PersonType2': [
    'nc.PersonSurName',
    'nc.PersonGivenName'
  ],

  // CASE
  'general.case': [
    'justice.courtcasenumber'
  ],
  'justice.case': [
    'justice.courtcasenumber'
  ],
  'danecountywi.dacase': [
    'justice.courtcasenumber'
  ],

  // LOCATION
  'general.location': [
    'general.address'
  ],
  'general.LocationType': [
    'nc.LocationCityName',
    'nc.LocationStateName'
  ],

  // BOOKINGS
  'j.BookingType': [
    'publicsafety.CustodyID',
    'j.SubjectBooking'
  ],
  'sample.bookings2': [
    'publicsafety.datebooked2'
  ],
  'jciowa.JailBookingType2': [
    'publicsafety.datebooked2'
  ],
  'jciowa.BookingType': [
    'publicsafety.datebooked2'
  ],

  // CHARGES
  'j.ChargeType': [
    'j.ArrestCharge',
    'publicsafety.datereleased2'
  ],
  'jciowa.ChargeType': [
    'j.ChargeSequenceID',
    'j.CourtEventCase'
  ],
  'jciowa.ChargesType': [
    'j.ChargeSequenceID',
    'j.CourtEventCase'
  ],
  'jciowa.ChargesType2': [
    'j.ChargeSequenceID',
    'j.CourtEventCase'
  ],

  // JAIL RECORDS
  'jciowa.JailRecordType': [
    'publicsafety.ArrestID'
  ],
  'jciowa.JailRecordType2': [
    'publicsafety.ArrestID'
  ],

  // ENFORCEMENT OFFICIALS
  'j.EnforcementOfficialType': [
    'j.EnforcementOfficialCategoryText',
    'nc.PersonSurName'
  ],
  'j.EnforcementOfficialType2': [
    'j.EnforcementOfficialCategoryText',
    'nc.PersonSurName'
  ],

  // OFFENSE TYPES
  'jciowa.OffenseType': [
    'publicsafety.OffenseViolatedStateStatute',
    'publicsafety.OffenseViolatedLocalStatute'
  ],
  'jciowa.OffensesType': [
    'publicsafety.OffenseViolatedStateStatute',
    'publicsafety.OffenseViolatedLocalStatute'
  ],
  'jciowa.OffensesType2': [
    'publicsafety.OffenseViolatedStateStatute',
    'publicsafety.OffenseViolatedLocalStatute'
  ],

  // SENTENCE TYPES
  'jciowa.SentenceType': [
    'publicsafety.SentenceTermDays',
    'publicsafety.SentenceTermHours'
  ],
  'jciowa.SentencesType': [
    'publicsafety.SentenceTermDays',
    'publicsafety.SentenceTermHours'
  ],
  'jciowa.SentencesType2': [
    'publicsafety.SentenceTermDays',
    'publicsafety.SentenceTermHours'
  ],

  // OTHER
  'publicsafety.GangType': [
    'publicsafety.GangName'
  ],
  'j.WarrantType': [
    'j.WarrantLevelText'
  ],
  'j.ServiceCallType': [
    'publicsafety.CadEventNumber'
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
  const titleProps = titleProperties[getFqn(entityType)];
  if (titleProps) {
    const titleValues = titleProps.map((propertyTypeFqn) => {
      return formattedRow[propertyTypeFqn];
    });
    if (titleValues.length) return titleValues.join(', ');
  }
  return `[${entityType.title}]`;
}

// just a copy of getTitle, but passing in selectedEntity instead
// this should all just be temporary
export function getTitleV2(entityType, selectedEntity) {
  const formattedRow = selectedEntity.get('data').toJS();
  const titleProps = titleProperties[getFqn(entityType)];
  if (titleProps) {
    const titleValues = titleProps.map((propertyTypeFqn) => {
      return formattedRow[propertyTypeFqn];
    });
    if (titleValues.length) return titleValues.join(', ');
  }
  return `[${entityType.title}]`;
}
