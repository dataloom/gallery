const SCHEMA = 'schema';
const ENTITY_SET = 'entitySet';
const ENTITY_TYPE = 'entityType';
const PROPERTY_TYPE = 'propertyType';

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

export default {
  SCHEMA,
  ENTITY_SET,
  ENTITY_TYPE,
  PROPERTY_TYPE,
  EDM_PRIMITIVE_TYPES
};
