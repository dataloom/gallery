import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import CatalogApi from '../../../../utils/CatalogApi';

export class EntityTypeFqn extends React.Component {
  static propTypes = {
    entityTypeFqn: PropTypes.object,
    schemaName: PropTypes.string,
    schemaNamespace: PropTypes.string,
    updateFn: PropTypes.func
  }

  deleteProp = () => {
    const fqnSet = [{
      name: this.props.entityTypeFqn.name,
      namespace: this.props.entityTypeFqn.namespace
    }];
    CatalogApi.deleteTypeFromSchema(
      this.props.schemaNamespace,
      this.props.schemaName,
      fqnSet,
      this.props.updateFn
    );
  }

  render() {
    const fqn = this.props.entityTypeFqn;
    return (
      <tr className={'tableRows'}>
        <td><Button bsSize="xsmall" bsStyle="danger" onClick={this.deleteProp}>-</Button></td>
        <td className={'tableCell'}>{fqn.name}</td>
        <td className={'tableCell'}>{fqn.namespace}</td>
      </tr>
    );
  }
}

export default EntityTypeFqn;
