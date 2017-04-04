import React, { PropTypes } from 'react';

import StringConsts from '../../../../utils/Consts/StringConsts';
import styles from '../styles.module.css';
import DeleteButton from '../../../../components/buttons/DeleteButton';

import { PermissionsPanel } from './PermissionsPanel';

export class Property extends React.Component {
  static propTypes = {
    property: PropTypes.object,
    primaryKey: PropTypes.bool,
    editingPermissions: PropTypes.bool,
    entitySetName: PropTypes.string,
    isOwner: PropTypes.bool,
    verifyDeleteFn: PropTypes.func
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor() {
    super();
    this.state = {
      showPanel: false
    };
  }

  isPrimaryKey() {
    if (this.props.primaryKey) {
      return (<td className={styles.primaryKey}>(primary key)</td>);
    }
    return null;
  }

  editPermissionsButton = () => {
    if (this.props.editingPermissions && this.props.isOwner) {
      return (
        <td>
          <button onClick={this.editPermissions} className={styles.simpleButton}>Change permissions</button>
        </td>
      );
    }
    return null;
  }

  editPermissions = () => {
    this.setState({ showPanel: true });
  }

  exitPanel = () => {
    this.setState({ showPanel: false });
  }

  renderEditPermissions = (prop) => {
    if (this.props.isOwner) {
      const className = (this.state.showPanel) ? StringConsts.EMPTY : styles.hidden;
      return (
        <td className={className}>
          <PermissionsPanel
              entitySetName={this.props.entitySetName}
              propertyTypeName={prop.name}
              propertyTypeNamespace={prop.namespace}
              exitPanel={this.exitPanel} />
        </td>
      );
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
        <td className={styles.tableCell}>{prop.type.name}</td>
        <td className={styles.tableCell}>{prop.type.namespace}</td>
        <td className={styles.tableCell}>{prop.title}</td>
        {this.isPrimaryKey()}
        {this.editPermissionsButton()}
        {this.renderEditPermissions(prop)}
      </tr>
    );
  }
}

export default Property;
