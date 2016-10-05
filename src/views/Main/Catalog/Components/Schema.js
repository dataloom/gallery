import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { PropertyTypeList } from './PropertyTypeList';
import CatalogApi from '../../../../utils/CatalogApi';
import Consts from '../../../../utils/AppConsts';
import { EntityTypeFqnList } from './EntityTypeFqnList';

export class Schema extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    propertyTypes: PropTypes.array,
    entityTypeFqns: PropTypes.array,
    jsonContents: PropTypes.object,
    updateFn: PropTypes.func
  }

  constructor() {
    super();
    this.state = {
      error: Consts.ERROR_STATE.hide,
      disableJson: false
    };
  }

  handleClick = () => {
    this.setState({ disableJson: true });
    this.downloadFile(Consts.JSON);
  }

  downloadFile = (datatype) => {
    CatalogApi.downloadSchema(
      this.props.jsonContents,
      this.props.name,
      datatype,
      this.enableButton
    );
  }

  displayError = () => {
    this.setState({
      error: Consts.ERROR_STATE.show,
      disableJson: false
    });
  }

  enableButton = (datatype) => {
    if (datatype === Consts.JSON) {
      this.setState({ disableJson: false });
    }
  }

  render() {
    const { name, namespace, propertyTypes, entityTypeFqns, updateFn } = this.props;
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
        <EntityTypeFqnList
          entityTypeFqns={entityTypeFqns}
          schemaName={name}
          schemaNamespace={namespace}
          updateFn={updateFn}
        />
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
