import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { PropertyList } from './PropertyList';
import styles from '../styles.module.css';
import CatalogApi from '../../../../utils/CatalogApi';
import Consts from '../../../../utils/AppConsts';

export class EntityType extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    properties: PropTypes.string,
    primaryKey: PropTypes.string
  }

  constructor() {
    super();
    this.downloadFile = this.downloadFile.bind(this);
  }

  downloadFile(datatype) {
    CatalogApi.downloadEntityType(this.props.namespace, this.props.name, datatype);
  }

  render() {
    const { name, namespace, properties, primaryKey } = this.props;
    return (
      <div className="entityType" style={{ left: '20', margin: '50', background: '#f6f6f6', padding: '20' }}>
        <div style={{ display: 'inline', fontWeight: 'bold', fontSize: '18' }} className={styles.schemaName}>{name}</div>
        <div style={{ display: 'inline', color: 'gray' }} className="entityTypeNameLabel"> (name)</div>
        <br />
        <div style={{ display: 'inline', fontSize: '16' }}className="entityTypeNamespace">{namespace}</div>
        <div style={{ display: 'inline', color: 'gray' }} className="entityTypeNamespaceLabel"> (namespace)</div>
        <br />
        <div style={{ height: '20' }} />
        <div style={{ color: 'gray' }}className="propertiesLabel">Properties:</div>
        <PropertyList properties={properties} primaryKey={primaryKey} />
        <br />
        <Button onClick={() => this.downloadFile(Consts.JSON)}>Download {name} as JSON</Button>
        <Button onClick={() => this.downloadFile(Consts.CSV)} style={{ marginLeft: '10' }}>Download {name} as CSV</Button>
      </div>
    );
  }
}

export default EntityType;
