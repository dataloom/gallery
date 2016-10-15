import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { EntityDataModelApi } from 'loom-data';
import Consts from '../../../../utils/AppConsts';

export class PropertyType extends React.Component {
  static propTypes = {
    propertyType: PropTypes.object,
    navBar: PropTypes.bool,
    error: PropTypes.func,
    updateFn: PropTypes.func,
    schemaName: PropTypes.string,
    schemaNamespace: PropTypes.string
  }

  deleteProp = () => {
    EntityDataModelApi.removePropertyTypesFromSchema(
      {
        namespace: this.props.schemaNamespace,
        name: this.props.schemaName
      },
      [{
        namespace: this.props.propertyType.namespace,
        name: this.props.propertyType.name
      }]
    ).then(() => this.props.updateFn())
    .catch(() => this.props.error());
  }

  shouldShowDeleteButton = () => (this.props.navBar ? Consts.HIDDEN : Consts.EMPTY);

  render() {
    const prop = this.props.propertyType;
    return (
      <tr className={'tableRows'}>
        <td className={this.shouldShowDeleteButton()}>
          <Button bsSize="xsmall" bsStyle="danger" onClick={this.deleteProp}>-</Button>
        </td>
        <td className={'tableCell'}>{prop.name}</td>
        <td className={'tableCell'}>{prop.namespace}</td>
        <td className={'tableCell'}>{prop.datatype}</td>
        <td className={'tableCell'}>{prop.multiplicity}</td>
      </tr>
    );
  }
}

export default PropertyType;
