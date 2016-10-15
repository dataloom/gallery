import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { EntityDataModelApi } from 'loom-data';
import Consts from '../../../../utils/AppConsts';

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
    EntityDataModelApi.removePropertyTypesFromEntityType(
      {
        namespace: this.props.entityTypeNamespace,
        name: this.props.entityTypeName
      },
      [{
        namespace: this.props.property.namespace,
        name: this.props.property.name
      }]
    ).then(() => this.props.updateFn());
  }

  shouldShowDeleteButton = () => (this.props.primaryKey ? Consts.HIDDEN : Consts.EMPTY);

  render() {
    const prop = this.props.property;
    return (
      <tr className={'tableRows'}>
        <td>
          <Button
            bsSize="xsmall"
            bsStyle="danger"
            onClick={this.deleteProp}
            className={this.shouldShowDeleteButton()}
          >-</Button>
        </td>
        <td className={'tableCell'}>{prop.name}</td>
        <td className={'tableCell'}>{prop.namespace}</td>
        {this.isPrimaryKey()}
      </tr>
    );
  }
}

export default Property;
