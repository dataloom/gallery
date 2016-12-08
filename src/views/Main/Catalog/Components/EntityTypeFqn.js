import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../../utils/Utils';
import PermissionsConsts from '../../../../utils/Consts/PermissionsConsts';
import styles from '../styles.module.css';

export class EntityTypeFqn extends React.Component {
  static propTypes = {
    entityTypeFqn: PropTypes.object,
    schemaName: PropTypes.string,
    schemaNamespace: PropTypes.string,
    updateFn: PropTypes.func,
    errorFn: PropTypes.func
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  deleteProp = () => {
    const { schemaNamespace, schemaName, entityTypeFqn, updateFn, errorFn } = this.props;
    EntityDataModelApi.removeEntityTypesFromSchema(Utils.getFqnObj(schemaNamespace, schemaName), [entityTypeFqn])
    .then(() => {
      return updateFn();
    }).catch(() => {
      return errorFn(PermissionsConsts.REMOVE);
    });
  }

  renderDeleteButton = () => {
    if (this.context.isAdmin) {
      return (
        <td>
          <button className={styles.deleteButton} onClick={this.deleteProp}>-</button>
        </td>
      );
    }
    return (
      <td />
    );
  }

  render() {
    const fqn = this.props.entityTypeFqn;
    return (
      <tr className={styles.tableRows}>
        {this.renderDeleteButton()}
        <td className={styles.tableCell}>{fqn.name}</td>
        <td className={styles.tableCell}>{fqn.namespace}</td>
      </tr>
    );
  }
}

export default EntityTypeFqn;
