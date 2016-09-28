import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import '../styles.module.css';
import { PropertyTypeList } from './PropertyTypeList';
import CatalogApi from '../../../../utils/CatalogApi';
import Consts from '../../../../utils/AppConsts';
import { EntityTypeFqnList } from './EntityTypeFqnList';

export class Schema extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    propertyTypes: PropTypes.string,
    entityTypeFqns: PropTypes.string
  }

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.displayError = this.displayError.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.state = {
      error: Consts.ERROR_STATE.hide,
      disableJson: false
    };
  }

  handleClick() {
    this.downloadFile(Consts.JSON);
    this.setState({ disableJson: true });
  }

  downloadFile(datatype) {
    CatalogApi.downloadSchema(
      this.props.name,
      datatype,
      this.props.entityTypeFqns,
      this.displayError,
      this.enableButton
    );
  }

  displayError() {
    this.setState({
      error: Consts.ERROR_STATE.show,
      disableJson: false
    });
  }

  enableButton() {
    this.setState({ disableJson: false });
  }

  render() {
    const { name, namespace, propertyTypes, entityTypeFqns } = this.props;
    return (
      <div className={'edmContainer'}>
        <div className={'name'}>{name}</div>
        <div className={'descriptionLabel'}> (name)</div>
        <br />
        <div className={'subtitle'}>{namespace}</div>
        <div className={'descriptionLabel'}> (namespace)</div>
        <br />
        <div className={'spacerMed'} />
        <div className={'tableDescriptionLabel'}>Entity Types:</div>
        <EntityTypeFqnList entityTypeFqns={entityTypeFqns} />
        <br />
        <div className={'spacerMed'} />
        <div className={'tableDescriptionLabel'}>Property Types:</div>
        <PropertyTypeList propertyTypes={propertyTypes} />
        <br />
        <Button onClick={this.handleClick} disabled={this.state.disableJson}>Download {name} as JSON</Button>
        <div className={this.state.error}>Unable to download {name}</div>
      </div>
    );
  }
}

export default Schema;
