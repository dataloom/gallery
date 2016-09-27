import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { PropertyList } from './PropertyList';
import styles from '../styles.module.css';
import CatalogApi from '../../../../utils/CatalogApi';

export class EntityType extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    properties: PropTypes.string
  }

  constructor() {
    super();
    this.downloadJson = this.downloadJson.bind(this);
  }

  downloadJson() {
    CatalogApi.downloadEntityTypeJson(this.props.namespace, this.props.name);
  }

  render() {
    const { name, namespace, properties } = this.props;
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
        <PropertyList properties={properties} />
        <br />
        <Button onClick={this.downloadJson}>Download {name} as JSON</Button>
      </div>
    );
  }
}

export default EntityType;
