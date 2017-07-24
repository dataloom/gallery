import React, { PropTypes } from 'react';

import styles from '../styles.module.css';
import DeleteButton from '../../../../components/buttons/DeleteButton';

export class Property extends React.Component {
  static propTypes = {
    property: PropTypes.object,
    primaryKey: PropTypes.bool,
    entitySetName: PropTypes.string,
    verifyDeleteFn: PropTypes.func
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  isPrimaryKey() {
    if (this.props.primaryKey) {
      return (<td className={styles.primaryKey}>(primary key)</td>);
    }
    return null;
  }

  renderDeleteButton = () => {
    if (!this.context.isAdmin || this.props.primaryKey || this.props.entitySetName) return <td />;
    return (
      <td>
        <DeleteButton
            onClick={() => {
              this.props.verifyDeleteFn(this.props.property);
            }} />
      </td>
    );
  }

  render() {
    const prop = this.props.property;
    return (
      <tr className={styles.tableRows}>
        {this.renderDeleteButton()}
        <td className={styles.tableCell}>{prop.type.namespace}</td>
        <td className={styles.tableCell}>{prop.type.name}</td>
        <td className={styles.tableCell}>{prop.title}</td>
        {this.isPrimaryKey()}
      </tr>
    );
  }
}

export default Property;
