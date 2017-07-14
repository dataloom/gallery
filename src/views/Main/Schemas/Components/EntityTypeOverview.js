import React, { PropTypes } from 'react';

import styles from '../styles.module.css';
import DeleteButton from '../../../../components/buttons/DeleteButton';

export class EntityTypeOverview extends React.Component {
  static propTypes = {
    entityType: PropTypes.object.isRequired,
    deleteFn: PropTypes.func.isRequired
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  renderDeleteButton = () => {
    if (!this.context.isAdmin) return <td />;
    return (
      <td>
        <DeleteButton
            onClick={() => {
              this.props.deleteFn(this.props.entityType);
            }} />
      </td>
    );
  }

  render() {
    const entityType = this.props.entityType;
    return (
      <tr className={styles.tableRows}>
        {this.renderDeleteButton()}
        <td className={styles.tableCell}>{entityType.type.name}</td>
        <td className={styles.tableCell}>{entityType.type.namespace}</td>
        <td className={styles.tableCell}>{entityType.title}</td>
      </tr>
    );
  }
}

export default EntityTypeOverview;
