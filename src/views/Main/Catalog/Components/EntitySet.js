import React, { PropTypes } from 'react';
import { PropertyTypeList } from './PropertyTypeList';
import { Button } from 'react-bootstrap';
import styles from '../styles.module.css';
import CatalogApi from '../../../../utils/CatalogApi';

export class EntitySet extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    typename: PropTypes.string
  }

  constructor() {
    super();
    this.downloadJson = this.downloadJson.bind(this);
  }

  downloadJson() {
  //  CatalogApi.downloadEntitySetJson(this.props.namespace, this.props.name);
    return null;
  }

  render() {
    const { name, title, typename } = this.props;
    return (
      <div className="entitySet" style={{ left: '20', margin: '50', background: '#f6f6f6', padding: '20' }}>
        <div style={{ display: 'inline', fontWeight: 'bold', fontSize: '18' }} className={styles.schemaName}>{name}</div>
        <div style={{ display: 'inline', color: 'gray' }} className="entitySetNameLabel"> (name)</div>
        <br />
        <div style={{ display: 'inline', fontSize: '16' }}className="entitySetTitle">{title}</div>
        <div style={{ display: 'inline', color: 'gray' }} className="entitySetTitleLabel"> (title)</div>
        <br />
        <div style={{ display: 'inline', fontSize: '16' }}className="entitySetTypename">{typename}</div>
        <div style={{ display: 'inline', color: 'gray' }} className="entitySetTypenameLabel"> (typename)</div>
        <div style={{ height: '15' }} />
        <Button onClick={this.downloadJson}>Download {name} as JSON</Button>
      </div>
    );
  }
}

export default EntitySet;
