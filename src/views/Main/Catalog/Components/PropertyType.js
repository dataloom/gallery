import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import CatalogApi from '../../../../utils/CatalogApi';

export class PropertyType extends React.Component {
  static propTypes = {
    propertyType: PropTypes.object,
    name: PropTypes.string,
    namespace: PropTypes.string,
    updateFn: PropTypes.func,
    navBar: PropTypes.bool
  }

  deleteProp = () => {
    const fqnSet = [{
      name: this.props.name,
      namespace: this.props.namespace
    }];
    CatalogApi.deletePropFromSchema(
      fqnSet.namespace,
      fqnSet.name,
      fqnSet,
      this.props.updateFn
    );
  }

  shouldShowDeleteButton = () => {
    return (this.props.navBar) ? 'hidden' : '';
  }

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
