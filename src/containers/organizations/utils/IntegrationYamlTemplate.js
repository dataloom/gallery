const TEMPLATE_CONSTANTS = {

  // entered by user
  DATA_SQL_TYPE: '<dataSQLType>',
  TARGET_SERVER: '<targetServer>',
  TARGET_PORT: '<targetPort>',
  TARGET_DB_NAME: '<targetDBName>',

  // computed based on DATA_SQL_TYPE
  SQL_DRIVER_STRING: '<sqlDriverString>',

  // computed based on organization
  ORG_ID: '<orgID>',
  ORG_NAME: '<orgName>',
  ORG_NAME_SHORT: '<orgNameShort>',
  ORG_USERNAME: '<orgUsername>',
  ORG_PASSWORD: '<orgPassword>'
};

const TEMPLATE =
`name: "${TEMPLATE_CONSTANTS.ORG_NAME}_initial_transfer"
description: "Copying over data from ${TEMPLATE_CONSTANTS.ORG_NAME} into OpenLattice server"
datasources:
- name: pdSQLDB
  url: "jdbc:${TEMPLATE_CONSTANTS.DATA_SQL_TYPE}://${TEMPLATE_CONSTANTS.TARGET_SERVER}:${TEMPLATE_CONSTANTS.TARGET_PORT}/${TEMPLATE_CONSTANTS.TARGET_DB_NAME}"
  username: "<INSERT_USERNAME_HERE>"
  password: "<INSERT_PASSWORD_HERE>"
  driver: ${TEMPLATE_CONSTANTS.SQL_DRIVER_STRING}
  fetchSize: 20000
destinations:
- name: openLatticeDB
  url: "jdbc:postgresql://atlas.openlattice.com:30001/${TEMPLATE_CONSTANTS.ORG_ID}?ssl=true&sslmode=require"
  driver: org.postgresql.Driver
  username: "${TEMPLATE_CONSTANTS.ORG_USERNAME}"
  password: "${TEMPLATE_CONSTANTS.ORG_PASSWORD}"
integrations:
  pdSQLDB:
    openLatticeDB:
      - source: "<INSERT_SELECT_TABLES_STATEMENT_HERE>"
        destination: ${TEMPLATE_CONSTANTS.ORG_NAME_SHORT}_data_Tables
        description: "${TEMPLATE_CONSTANTS.ORG_NAME_SHORT} table listing"
      - source: "select '( select * from ' || "TABLE_NAME" || ' ) ' || 'tbl_' || "TABLE_NAME" as query, "TABLE_NAME" as destination, 'gluttony'  as description from ${TEMPLATE_CONSTANTS.ORG_NAME_SHORT}_data_Tables;"
        destination: "dst"
        description: "gluttony"
        gluttony: true
`;

export {
  TEMPLATE,
  TEMPLATE_CONSTANTS
};
