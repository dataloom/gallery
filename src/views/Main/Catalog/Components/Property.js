import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import CatalogApi from '../../../../utils/CatalogApi';

export class Property extends React.Component {
  static propTypes = {
    property: PropTypes.object,
    primaryKey: PropTypes.bool,
    entityTypeName: PropTypes.string,
    entityTypeNamespace: PropTypes.string,
    updateFn: PropTypes.func
  }

  isPrimaryKey() {
    const pKey = this.props.primaryKey;
    if (pKey) {
      return (<td className={'primaryKey'}>(primary key)</td>);
    }
    return null;
  }

  deleteProp = () => {
    const fqnSet = [{
      name: this.props.entityTypeName,
      namespace: this.props.entityTypeNamespace
    }];
    CatalogApi.deletePropFromType(
      fqnSet.namespace,
      fqnSet.name,
      fqnSet,
      this.props.updateFn
    );
  }

  shouldShowDeleteButton = () => {
    return (this.props.primaryKey) ? 'hidden' : '';
  }

  render() {
    const prop = this.props.property;
    return (
      <tr className={'tableRows'}>
        <td><Button
          bsSize="xsmall"
          bsStyle="danger"
          onClick={this.deleteProp}
          className={this.shouldShowDeleteButton()}
        >-</Button></td>
        <td className={'tableCell'}>{prop.name}</td>
        <td className={'tableCell'}>{prop.namespace}</td>
        {this.isPrimaryKey()}
      </tr>
    );
  }
}

export default Property;
