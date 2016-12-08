import React, { PropTypes } from 'react';
import StringConsts from '../../../../utils/Consts/StringConsts';
import { PermissionsPanel } from './PermissionsPanel';
import styles from '../styles.module.css';

export class Property extends React.Component {
  static propTypes = {
    property: PropTypes.object,
    primaryKey: PropTypes.bool,
    editingPermissions: PropTypes.bool,
    entitySetName: PropTypes.string,
    isOwner: PropTypes.bool,
    verifyDeleteFn: PropTypes.func,
    isAdmin: PropTypes.bool
  }

  shouldShow = {
    true: StringConsts.EMPTY,
    false: styles.hidden
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

  shouldShowDeleteButton = () => {
    return (this.props.primaryKey || this.props.entitySetName) ? styles.hidden : styles.deleteButton;
  }

  renderEditPermissions = (prop) => {
    if (this.props.isOwner) {
      return (
        <td className={this.shouldShow[this.state.showPanel]}>
          <PermissionsPanel
            entitySetName={this.props.entitySetName}
            propertyTypeName={prop.name}
            propertyTypeNamespace={prop.namespace}
            exitPanel={this.exitPanel}
          />
        </td>
      );
    }
    return null;
  }

  renderDeleteButton = () => {
    const { property, isAdmin } = this.props;
    if (isAdmin) {
      return (
        <td>
          <button
            onClick={() => {
              this.props.verifyDeleteFn(property);
            }}
            className={this.shouldShowDeleteButton()}
          >-</button>
        </td>
      );
    }
    return (
      <td />
    );
  }

  render() {
    const prop = this.props.property;
    return (
      <tr className={styles.tableRows}>
        {this.renderDeleteButton()}
        <td className={styles.tableCell}>{prop.name}</td>
        <td className={styles.tableCell}>{prop.namespace}</td>
        {this.isPrimaryKey()}
        {this.editPermissionsButton()}
        {this.renderEditPermissions(prop)}
      </tr>
    );
  }
}

export default Property;
