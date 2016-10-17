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
      error: Consts.HIDDEN,
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
    DataApi.getAllEntitiesOfType({ namespace: this.props.namespace, name: this.props.name })
    .then(data => FileService.saveFile(data, this.props.name, datatype, this.enableButton))
    .catch(() => this.displayError());
  }

  displayError = (datatype) => {
    this.setState({ error: Consts.ERROR });
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
      <div className={'edmContainer'}>
        <div className={'name'}>{name}</div>
        <div className={'descriptionLabel'}> (name)</div>
        <br />
        <div className={'subtitle'}>{namespace}</div>
        <div className={'descriptionLabel'}> (namespace)</div>
        <br />
        <div className={'spacerMed'} />
        <div className={'tableDescriptionLabel'}>Properties:</div>
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
          className={'hidden'}
        >
          Download {name} as CSV
        </Button>
        <div className={this.state.error}>Unable to download {name}</div>
      </div>
    );
  }
}

export default EntityType;
