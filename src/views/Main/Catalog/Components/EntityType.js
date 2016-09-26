import React, { PropTypes } from 'react';
import { PropertyTypeList } from './PropertyTypeList';
import { Button } from 'react-bootstrap';
import styles from '../styles.module.css';
import CatalogApi from '../../../../utils/CatalogApi';

export class EntityType extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    propertyTypes: PropTypes.string
  }

  constructor() {
    super();
    this.downloadJson = this.downloadJson.bind(this);
  }

  downloadJson() {
    CatalogApi.downloadEntityTypeJson(this.props.namespace, this.props.name);
  }

  render() {
    const { name, namespace, propertyTypes } = this.props;
    return (
      <div className="schema" style={{ left: '20', margin: '50', background: '#f6f6f6', padding: '20' }}>
        <div style={{ display: 'inline', fontWeight: 'bold', fontSize: '18' }} className={styles.schemaName}>{name}</div>
        <div style={{ display: 'inline', color: 'gray' }} className="schemaNameLabel"> (name)</div>
        <br />
        <div style={{ display: 'inline', fontSize: '16' }}className="schemaNamespace">{namespace}</div>
        <div style={{ display: 'inline', color: 'gray' }} className="schemaNamespaceLabel"> (namespace)</div>
        <br />
        <div style={{ height: '20' }} />
        <div style={{ color: 'gray' }}className="propertyTypesLabel">Property Types:</div>
        <PropertyTypeList propertyTypes={propertyTypes} />
        <br />
        <Button onClick={this.downloadJson}>Download {name} as JSON</Button>
      </div>
    );
  }
}

export default EntityType;
