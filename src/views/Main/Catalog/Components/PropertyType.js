import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import CatalogApi from '../../../../utils/CatalogApi';

export class PropertyType extends React.Component {
  static propTypes = {
    propertyType: PropTypes.object,
    name: PropTypes.string,
    namespace: PropTypes.string,
    updateFn: PropTypes.func
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

  render() {
    const prop = this.props.propertyType;
    return (
      <tr className={'tableRows'}>
        <td><Button bsSize="xsmall" bsStyle="danger" onClick={this.deleteProp}>-</Button></td>
        <td className={'tableCell'}>{prop.name}</td>
        <td className={'tableCell'}>{prop.namespace}</td>
        <td className={'tableCell'}>{prop.datatype}</td>
        <td className={'tableCell'}>{prop.multiplicity}</td>
      </tr>
    );
  }
}

export default PropertyType;
