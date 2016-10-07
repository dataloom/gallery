import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { PropertyList } from './PropertyList';
import CatalogApi from '../../../../utils/CatalogApi';
import Consts from '../../../../utils/AppConsts';

export class EntityType extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    properties: PropTypes.array,
    primaryKey: PropTypes.array,
    updateFn: PropTypes.func
  }

  constructor() {
    super();
    this.state = {
      error: Consts.ERROR_STATE.hide,
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
    CatalogApi.downloadEntityType(
      this.props.namespace,
      this.props.name,
      datatype,
      this.displayError,
      this.enableButton
    );
  }

  displayError = (datatype) => {
    this.setState({ error: Consts.ERROR_STATE.show });
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
    const { name, namespace, properties, primaryKey, updateFn } = this.props;
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
          className={'spacerMargin'}
        >
          Download {name} as CSV
        </Button>
        <div className={this.state.error}>Unable to download {name}</div>
      </div>
    );
  }
}

export default EntityType;
