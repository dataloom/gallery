import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { EntityDataModelApi } from 'loom-data';

export class EntityTypeFqn extends React.Component {
  static propTypes = {
    entityTypeFqn: PropTypes.object,
    schemaName: PropTypes.string,
    schemaNamespace: PropTypes.string,
    updateFn: PropTypes.func
  }

  deleteProp = () => {
    EntityDataModelApi.removeEntityTypesFromSchema(
      {
        namespace: this.props.schemaNamespace,
        name: this.props.schemaName
      },
      [{
        namespace: this.props.entityTypeFqn.namespace,
        name: this.props.entityTypeFqn.name
      }]
    ).then(() => this.props.updateFn());
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
