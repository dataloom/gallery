import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import styles from '../styles.module.css';


export class EntityTypeFqn extends React.Component {
  static propTypes = {
    entityTypeFqn: PropTypes.object,
    updateSchemaFn: PropTypes.func
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  deleteProp = () => {
    this.props.updateSchemaFn([this.props.entityTypeFqn.id], ActionConsts.REMOVE, EdmConsts.ENTITY_TYPE);
  }

  renderDeleteButton = () => {
    if (this.context.isAdmin) {
      return (
        <td>
          <button className={styles.deleteButton} onClick={this.deleteProp}>
            <FontAwesome name="minus" />
          </button>
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
        <td className={styles.tableCell}>{fqn.type.name}</td>
        <td className={styles.tableCell}>{fqn.type.namespace}</td>
        <td className={styles.tableCell}>{fqn.title}</td>
      </tr>
    );
  }
}

export default EntityTypeFqn;
