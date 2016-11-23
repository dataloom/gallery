const SCHEMA = 'schema';
const ENTITY_SET = 'entitySet';
const ENTITY_TYPE = 'entityType';
const PROPERTY_TYPE = 'propertyType';

const EDM_PRIMITIVE_TYPES = [
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

const EDM_NUMBER_TYPES = [
  'Decimal',
  'Double',
  'Int16',
  'Int32',
  'Int64'
];

const EDM_GEOGRAPHY_TYPES = [
  'Geography',
  'GeographyPoint',
  'GeographyLineString',
  'GeographyPolygon',
  'GeographyMultiPoint',
  'GeographyMultiLineString',
  'GeographyMultiPolygon',
  'GeographyCollection'
];

export default {
  SCHEMA,
  ENTITY_SET,
  ENTITY_TYPE,
  PROPERTY_TYPE,
  EDM_PRIMITIVE_TYPES,
  EDM_NUMBER_TYPES,
  EDM_GEOGRAPHY_TYPES
};
