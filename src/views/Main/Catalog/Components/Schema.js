import React, { PropTypes } from 'react';
import { PropertyTypeList } from './PropertyTypeList';
import { Button } from 'react-bootstrap';
import styles from '../styles.module.css';
import CatalogApi from '../../../../utils/CatalogApi';
import Consts from '../../../../utils/AppConsts';
import { EntityTypeFqnList } from './EntityTypeFqnList';

export class Schema extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    propertyTypes: PropTypes.string,
    entityTypeFqns: PropTypes.string
  }

  constructor() {
    super();
    this.downloadFile = this.downloadFile.bind(this);
  }

  downloadFile(datatype) {
    CatalogApi.downloadSchema(this.props.name, datatype, this.props.entityTypeFqns);
  }

  render() {
    const { name, namespace, propertyTypes, entityTypeFqns } = this.props;
    return (
      <div className="schema" style={{ left: '20', margin: '50', background: '#f6f6f6', padding: '20' }}>
        <div style={{ display: 'inline', fontWeight: 'bold', fontSize: '18' }} className={styles.schemaName}>{name}</div>
        <div style={{ display: 'inline', color: 'gray' }} className="schemaNameLabel"> (name)</div>
        <br />
        <div style={{ display: 'inline', fontSize: '16' }}className="schemaNamespace">{namespace}</div>
        <div style={{ display: 'inline', color: 'gray' }} className="schemaNamespaceLabel"> (namespace)</div>
        <br />
        <div style={{ height: '20' }} />
        <div style={{ color: 'gray' }}className="entityTypeFqns">Entity Types:</div>
        <EntityTypeFqnList entityTypeFqns={entityTypeFqns} />
        <br />
        <div style={{ height: '20' }} />
        <div style={{ color: 'gray' }}className="propertyTypesLabel">Property Types:</div>
        <PropertyTypeList propertyTypes={propertyTypes} />
        <br />
        <Button onClick={() => this.downloadFile(Consts.JSON)}>Download {name} as JSON</Button>
        <Button onClick={() => this.downloadFile(Consts.CSV)} style={{ marginLeft: '10' }}>Download {name} as CSV</Button>
      </div>
    );
  }
}

export default Schema;
