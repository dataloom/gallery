const SCHEMA = 'schema';
const ENTITY_SET = 'entitySet';
const ENTITY_TYPE = 'entityType';
const ASSOCIATION_TYPE = 'associationType';
const PROPERTY_TYPE = 'propertyType';

const SCHEMA_TITLE = 'Schema';
const ENTITY_SET_TITLE = 'Entity Set';
const ENTITY_TYPE_TITLE = 'Entity Type';
const ASSOCIATION_TYPE_TITLE = 'Association Type';
const PROPERTY_TYPE_TITLE = 'Property Type';

const EDM_PRIMITIVE_TYPES = [
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

const EDM_NUMBER_TYPES = [
  'Decimal',
  'Double',
  'Int16',
  'Int32',
  'Int64'
];

const EDM_GEOGRAPHY_TYPES = [
  'GeographyPoint'
];

const EDM_DATE_TYPES = [
  'Date',
  'DateTimeOffset'
];

const ANALYZERS = {
  standard: 'STANDARD',
  metaphone: 'METAPHONE'
};

const ASSOCIATION_TYPE_FIELDS = {
  src: 'src',
  dst: 'dst'
};

export default {
  SCHEMA,
  ENTITY_SET,
  ENTITY_TYPE,
  ASSOCIATION_TYPE,
  SCHEMA_TITLE,
  ENTITY_SET_TITLE,
  ENTITY_TYPE_TITLE,
  ASSOCIATION_TYPE_TITLE,
  PROPERTY_TYPE_TITLE,
  PROPERTY_TYPE,
  EDM_PRIMITIVE_TYPES,
  EDM_NUMBER_TYPES,
  EDM_GEOGRAPHY_TYPES,
  EDM_DATE_TYPES,
  ANALYZERS,
  ASSOCIATION_TYPE_FIELDS
};
