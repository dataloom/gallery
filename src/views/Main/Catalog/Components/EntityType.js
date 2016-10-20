import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { DataApi } from 'loom-data';
import { PropertyList } from './PropertyList';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';

export class EntityType extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    properties: PropTypes.array,
    primaryKey: PropTypes.array,
    updateFn: PropTypes.func,
    id: PropTypes.number,
    allPropNames: PropTypes.object,
    allPropNamespaces: PropTypes.object
  }

  getUrl = (datatype) => {
    return DataApi.getAllEntitiesOfTypeUrl({ namespace: this.props.namespace, name: this.props.name }, datatype);
  }

  render() {
    const { name, namespace, properties, primaryKey, updateFn, id } = this.props;
    return (
      <div className={styles.edmContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.descriptionLabel}> (name)</div>
        <br />
        <div className={styles.subtitle}>{namespace}</div>
        <div className={styles.descriptionLabel}> (namespace)</div>
        <br />
        <div className={styles.spacerMed} />
        <div className={styles.tableDescriptionLabel}>Properties:</div>
        <PropertyList
          properties={properties}
          primaryKey={primaryKey}
          entityTypeName={name}
          entityTypeNamespace={namespace}
          updateFn={updateFn}
          id={id}
          allPropNames={this.props.allPropNames}
          allPropNamespaces={this.props.allPropNamespaces}
        />
        <br />
        <Button href={this.getUrl(Consts.JSON)}>
          Download {name} as JSON
        </Button>
        <Button href={this.getUrl(Consts.CSV)} className={styles.spacerMargin}>
          Download {name} as CSV
        </Button>
      </div>
    );
  }
}

export default EntityType;
