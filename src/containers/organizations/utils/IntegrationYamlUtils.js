import FileSaver from 'file-saver';

import { TEMPLATE, TEMPLATE_CONSTANTS } from './IntegrationYamlTemplate';

export const DATA_SQL_TYPES = {
  'Pervasive SQL': {
    driver: 'com.pervasive.jdbc.v2.Driver',
    connectionString: 'pervasive',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM MasterNameVitals',
    defaultPort: 0
  },
  'IBM DB2': {
    driver: 'COM.ibm.db2.jdbc.app.DB2Driver',
    connectionString: 'db2',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'JDBC-ODBC Bridge': {
    driver: 'sun.jdbc.odbc.JdbcOdbcDriver',
    connectionString: 'odbc',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'Microsoft SQL Server': {
    driver: 'weblogic.jdbc.mssqlserver4.Driver',
    connectionString: 'weblogic',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'PointBase Embedded Server': {
    driver: 'com.pointbase.jdbc.jdbcUniversalDriver',
    connectionString: 'pointbase',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'Cloudscape': {
    driver: 'COM.cloudscape.core.JDBCDriver',
    connectionString: 'cloudscape',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'Cloudscape RMI': {
    driver: 'RmiJdbc.RJDriver',
    connectionString: 'rmi',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'Firebird (JCA/JDBC Driver)': {
    driver: 'org.firebirdsql.jdbc.FBDriver',
    connectionString: 'firebirdsql',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'IDS Server': {
    driver: 'ids.sql.IDSDriver',
    connectionString: 'ids',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'Informix Dynamic Server': {
    driver: 'com.informix.jdbc.IfxDriver',
    connectionString: 'informix-sqli',
    connectionSuffixString: ':informixserver=<serverNameHere>;DELIMIDENT=Y',
    tablesSql: 'INFO TABLES',
    defaultPort: 0
  },
  'InstantDB (v3.13 and earlier)': {
    driver: 'jdbc.idbDriver',
    connectionString: 'idb',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'InstantDB (v3.14 and later)': {
    driver: 'org.enhydra.instantdb.jdbc.idbDriver',
    connectionString: 'idb',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'Interbase (InterClient Driver)': {
    driver: 'interbase.interclient.Driver',
    connectionString: 'interbase',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'Hypersonic SQL (v1.2 and earlier)': {
    driver: 'hSql.hDriver',
    connectionString: 'HypersonicSQL',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'Hypersonic SQL (v1.3 and later)': {
    driver: 'org.hsql.jdbcDriver',
    connectionString: 'HypersonicSQL',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'Microsoft SQL Server (JTurbo Driver)': {
    driver: 'com.ashna.jturbo.driver.Driver',
    connectionString: 'JTurbo',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'Microsoft SQL Server (Sprinta Driver)': {
    driver: 'com.inet.tds.TdsDriver',
    connectionString: 'inetdae',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'Microsoft SQL Server 2000 (Microsoft Driver)': {
    driver: 'com.microsoft.jdbc.sqlserver.SQLServerDriver',
    connectionString: 'microsoft',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'MySQL (MM.MySQL Driver)': {
    driver: 'org.gjt.mm.mysql.Driver',
    connectionString: 'mysql',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  Oracle: {
    driver: 'oracle.jdbc.driver.OracleDriver',
    connectionString: 'oracle',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'PostgreSQL (v6.5 and earlier)': {
    driver: 'postgresql.Driver',
    connectionString: 'postgresql',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM pg_catalog.pg_tables',
    defaultPort: 5432
  },
  'PostgreSQL (v7.0 and later)': {
    driver: 'org.postgresql.Driver',
    connectionString: 'postgresql',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM pg_catalog.pg_tables',
    defaultPort: 5432
  },
  'Sybase (jConnect 4.2 and earlier)': {
    driver: 'com.sybase.jdbc.SybDriver',
    connectionString: 'sybase',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  },
  'Sybase (jConnect 5.2)': {
    driver: 'com.sybase.jdbc2.jdbc.SybDriver',
    connectionString: 'sybase',
    connectionSuffixString: '',
    tablesSql: 'SELECT * FROM <metaTableGoesHere>',
    defaultPort: 0
  }
};

export const exportTemplate = ({
  dataSqlType,
  server,
  port,
  dbName,
  orgId,
  orgName,
  orgUsername,
  orgPassword
}) => {
  const { driver, connectionString, connectionSuffixString, tablesSql, defaultPort } = DATA_SQL_TYPES[dataSqlType];
  const orgIdShort = `org_${orgId.replace(/-/g, '')}`;
  const orgNameShort = orgName.replace(/[^a-zA-Z0-9]/g, '');

  const fieldMappings = {
    [TEMPLATE_CONSTANTS.DATA_SQL_TYPE]: connectionString,
    [TEMPLATE_CONSTANTS.DEFAULT_PORT]: defaultPort,
    [TEMPLATE_CONSTANTS.CONNECTION_SUFFIX_STRING]: connectionSuffixString,
    [TEMPLATE_CONSTANTS.SQL_DRIVER_STRING]: driver,
    [TEMPLATE_CONSTANTS.TABLE_LISTING_SQL]: tablesSql,
    [TEMPLATE_CONSTANTS.TARGET_SERVER]: server,
    [TEMPLATE_CONSTANTS.TARGET_PORT]: port,
    [TEMPLATE_CONSTANTS.TARGET_DB_NAME]: dbName,
    [TEMPLATE_CONSTANTS.ORG_ID]: orgIdShort,
    [TEMPLATE_CONSTANTS.ORG_NAME]: orgName,
    [TEMPLATE_CONSTANTS.ORG_NAME_SHORT]: orgNameShort,
    [TEMPLATE_CONSTANTS.ORG_USERNAME]: orgUsername,
    [TEMPLATE_CONSTANTS.ORG_PASSWORD]: orgPassword
  };

  let config = TEMPLATE;
  Object.entries(fieldMappings).forEach(([field, value]) => {
    config = config.replace(new RegExp(field, 'g'), value);
  });

  const blob = new Blob([config], {
    type: 'text/yaml'
  });

  FileSaver.saveAs(blob, 'openlattice.yaml');
};
