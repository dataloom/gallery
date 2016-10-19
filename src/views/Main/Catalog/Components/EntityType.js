import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { DataApi } from 'loom-data';
import { PropertyList } from './PropertyList';
import FileService from '../../../../utils/FileService';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';

export class EntityType extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    properties: PropTypes.array,
    primaryKey: PropTypes.array,
    updateFn: PropTypes.func,
    id: PropTypes.number
  }

  constructor() {
    super();
    this.state = {
      error: styles.hidden,
      disableJson: false,
      disableCsv: false
    };
  }

  handleClick = (datatype) => {
    this.downloadFile(datatype);
    if (datatype === Consts.JSON) {
      this.setState({ disableJson: true });
    }
    else {
      this.setState({ disableCsv: true });
    }
  }

  downloadFile = (datatype) => {
    DataApi.downloadAllEntitiesOfType({ namespace: this.props.namespace, name: this.props.name }, datatype)
    .then(data => FileService.saveFile(data, this.props.name, datatype, () => this.enableButton(datatype)))
    .catch(() => this.displayError());
  }

  displayError = (datatype) => {
    this.setState({ error: styles.errorMsg });
    this.enableButton(datatype);
  }

  enableButton = (datatype) => {
    if (datatype === Consts.JSON) {
      this.setState({ disableJson: false });
    }
    else {
      this.setState({ disableCsv: false });
    }
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
        />
        <br />
        <Button
          onClick={() => this.handleClick(Consts.JSON)}
          disabled={this.state.disableJson}
        >
          Download {name} as JSON
        </Button>
        <Button
          onClick={() => this.handleClick(Consts.CSV)}
          disabled={this.state.disableCsv}
          className={styles.spacerMargin}
        >
          Download {name} as CSV
        </Button>
        <div className={this.state.error}>Unable to download {name}</div>
      </div>
    );
  }
}

export default EntityType;
