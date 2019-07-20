import FileSaver from 'file-saver';

import { TEMPLATE, TEMPLATE_CONSTANTS } from './IntegrationYamlTemplate';

export const DATA_SQL_TYPES = {
  'Pervasive SQL': {
    driver: 'com.pervasive.jdbc.v2.Driver',
    connectionString: 'pervasive'
  },
  'IBM DB2': {
    driver: 'COM.ibm.db2.jdbc.app.DB2Driver',
    connectionString: 'db2'
  },
  'JDBC-ODBC Bridge': {
    driver: 'sun.jdbc.odbc.JdbcOdbcDriver',
    connectionString: 'odbc'
  },
  'Microsoft SQL Server': {
    driver: 'weblogic.jdbc.mssqlserver4.Driver',
    connectionString: 'weblogic'
  },
  'PointBase Embedded Server': {
    driver: 'com.pointbase.jdbc.jdbcUniversalDriver',
    connectionString: 'pointbase'
  },
  'Cloudscape': {
    driver: 'COM.cloudscape.core.JDBCDriver',
    connectionString: 'cloudscape'
  },
  'Cloudscape RMI': {
    driver: 'RmiJdbc.RJDriver',
    connectionString: 'rmi'
  },
  'Firebird (JCA/JDBC Driver)': {
    driver: 'org.firebirdsql.jdbc.FBDriver',
    connectionString: 'firebirdsql'
  },
  'IDS Server': {
    driver: 'ids.sql.IDSDriver',
    connectionString: 'ids'
  },
  'Informix Dynamic Server': {
    driver: 'com.informix.jdbc.IfxDriver',
    connectionString: 'informix-sqli'
  },
  'InstantDB (v3.13 and earlier)': {
    driver: 'jdbc.idbDriver',
    connectionString: 'idb'
  },
  'InstantDB (v3.14 and later)': {
    driver: 'org.enhydra.instantdb.jdbc.idbDriver',
    connectionString: 'idb'
  },
  'Interbase (InterClient Driver)': {
    driver: 'interbase.interclient.Driver',
    connectionString: 'interbase'
  },
  'Hypersonic SQL (v1.2 and earlier)': {
    driver: 'hSql.hDriver',
    connectionString: 'HypersonicSQL'
  },
  'Hypersonic SQL (v1.3 and later)': {
    driver: 'org.hsql.jdbcDriver',
    connectionString: 'HypersonicSQL'
  },
  'Microsoft SQL Server (JTurbo Driver)': {
    driver: 'com.ashna.jturbo.driver.Driver',
    connectionString: 'JTurbo'
  },
  'Microsoft SQL Server (Sprinta Driver)': {
    driver: 'com.inet.tds.TdsDriver',
    connectionString: 'inetdae'
  },
  'Microsoft SQL Server 2000 (Microsoft Driver)': {
    driver: 'com.microsoft.jdbc.sqlserver.SQLServerDriver',
    connectionString: 'microsoft'
  },
  'MySQL (MM.MySQL Driver)': {
    driver: 'org.gjt.mm.mysql.Driver',
    connectionString: 'mysql'
  },
  Oracle: {
    driver: 'oracle.jdbc.driver.OracleDriver',
    connectionString: 'oracle'
  },
  'PostgreSQL (v6.5 and earlier)': {
    driver: 'postgresql.Driver',
    connectionString: 'postgresql'
  },
  'PostgreSQL (v7.0 and later)': {
    driver: 'org.postgresql.Driver',
    connectionString: 'postgresql'
  },
  'Sybase (jConnect 4.2 and earlier)': {
    driver: 'com.sybase.jdbc.SybDriver',
    connectionString: 'sybase'
  },
  'Sybase (jConnect 5.2)': {
    driver: 'com.sybase.jdbc2.jdbc.SybDriver',
    connectionString: 'sybase'
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
  const { driver, connectionString } = DATA_SQL_TYPES[dataSqlType];
  const orgIdShort = `org_${orgId.replace(/-/g, '')}`;
  const orgNameShort = orgName.replace(/[^a-zA-Z0-9]/g, '');

  const fieldMappings = {
    [TEMPLATE_CONSTANTS.DATA_SQL_TYPE]: connectionString,
    [TEMPLATE_CONSTANTS.SQL_DRIVER_STRING]: driver,
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
