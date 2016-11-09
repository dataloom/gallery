import React, { PropTypes } from 'react';
import { DataApi, EntityDataModelApi } from 'loom-data';
import { PropertyList } from './PropertyList';
import { DropdownButton } from './DropdownButton';
import Consts from '../../../../utils/AppConsts';
import { PermissionsPanel } from './PermissionsPanel';
import styles from '../styles.module.css';

export class EntitySet extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      properties: [],
      editing: false,
      showPanel: false
    };
  }

  requestPermissionClass = {
    true: styles.requestPermissionWrapper,
    false: styles.hidden
  }

  shouldShowPermissionButton = {
    true: styles.simpleButton,
    false: styles.hidden
  }

  componentDidMount() {
    EntityDataModelApi.getEntityType(this.props.type)
    .then((type) => {
      this.setState({
        properties: type.properties
      });
    });
  }

  getUrl = (datatype) => {
    return DataApi.getAllEntitiesOfTypeInSetFileUrl(this.props.type, this.props.name, datatype);
  }

  requestPermission = (type) => {
    console.log(`give me ${type} access pls`);
  }

  shouldShow = {
    true: Consts.EMPTY,
    false: styles.hidden
  };

  changeEditingState = () => {
    this.setState({
      editing: !this.state.editing
    });
  }

  exitPanel = () => {
    this.setState({
      showPanel: false
    });
  }

  editEntitySetPermissions = () => {
    this.setState({ showPanel: true });
  }

  renderRequestPermissionButton = () => {
    const options = [Consts.READ, Consts.WRITE];
    return (
      <div className={this.requestPermissionClass[this.state.requestPermission !== undefined]}>
        <DropdownButton options={options} requestFn={this.requestPermission} />
      </div>
    );
  }

  render() {
    const { name, title, type } = this.props;
    const options = [Consts.CSV, Consts.JSON];
    return (
      <div className={styles.edmContainer}>
        <button onClick={this.changeEditingState} className={styles.permissionButton}>
          {(this.state.editing) ? 'Stop editing' : 'Edit permissions'}
        </button>
        <div className={styles.spacerSmall} />
        <div className={styles.name}>{name}</div>
        <div className={styles.spacerLeft} />
        <button
          className={this.shouldShowPermissionButton[this.state.editing]}
          onClick={this.editEntitySetPermissions}
        >Change permissions</button>
        <div className={styles.spacerMed} />
        <div className={styles.subtitle}>{title}</div>
        <div className={styles.spacerMed} />
        <div className={styles.dropdownButtonContainer}>
          <DropdownButton downloadUrlFn={this.getUrl} options={options} />
        </div>
        {this.renderRequestPermissionButton()}
        <br />
        <div className={styles.spacerSmall} />
        <div className={this.shouldShow[this.state.showPanel]}>
          <PermissionsPanel entitySetName={name} entityType={type} exitPanel={this.exitPanel} />
        </div>
        <div>
          <table>
            <tbody>
              <tr>
                <th className={styles.tableCell}>Entity Type Name</th>
                <th className={styles.tableCell}>Entity Type Namespace</th>
              </tr>
              <tr className={styles.tableRows}>
                <td className={styles.tableCell}>{type.name}</td>
                <td className={styles.tableCell}>{type.namespace}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.spacerBig} />
        <PropertyList
          properties={this.state.properties}
          entityTypeName={type.name}
          entityTypeNamespace={type.namespace}
          allowEdit={false}
          entitySetName={name}
          editingPermissions={this.state.editing}
        />
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default EntitySet;
