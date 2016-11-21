import React, { PropTypes } from 'react';
import { DataApi, EntityDataModelApi, PermissionsApi } from 'loom-data';
import { PropertyList } from './PropertyList';
import { DropdownButton } from './DropdownButton';
import Consts from '../../../../utils/AppConsts';
import AuthService from '../../../../utils/AuthService';
import { PermissionsPanel } from './PermissionsPanel';
import { Visualization } from '../../Visualizations/Visualization';
import styles from '../styles.module.css';

const permissionLevels = {
  hidden: [],
  discover: [Consts.DISCOVER],
  read: [Consts.DISCOVER, Consts.READ],
  write: [Consts.DISCOVER, Consts.READ, Consts.WRITE]
};

export class EntitySet extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.object,
    permissions: PropTypes.array,
    isOwner: PropTypes.bool,
    auth: PropTypes.instanceOf(AuthService)
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

  shouldAllowEditPermissions = {
    true: styles.permissionButton,
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
    PermissionsApi.addPermissionsRequestForPropertyTypesInEntitySet([{
      principal: {
        type: Consts.USER,
        name: this.props.auth.getProfile().email
      },
      action: Consts.REQUEST,
      name: this.props.name,
      permissions: permissionLevels[type]
    }]);
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

  renderDownloadButton = (options) => {
    if (options !== undefined) {
      return (
        <div className={styles.dropdownButtonContainer}>
          <DropdownButton downloadUrlFn={this.getUrl} options={options} />
        </div>
      );
    }
    return null;
  }

  renderRequestPermissionButton = (options) => {
    if (options !== undefined) {
      return (
        <div className={styles.requestPermissionWrapper}>
          <DropdownButton options={options} requestFn={this.requestPermission} />
        </div>
      );
    }
    return null;
  }

  renderDownloadOrRequestDropdowns = () => {
    let downloadOptions;
    let requestOptions;
    const permissions = this.props.permissions;
    if (permissions.includes(Consts.WRITE.toUpperCase())) {
      downloadOptions = [Consts.CSV, Consts.JSON];
    }
    else if (permissions.includes(Consts.READ.toUpperCase())) {
      downloadOptions = [Consts.CSV, Consts.JSON];
      requestOptions = [Consts.WRITE];
    }
    else {
      requestOptions = [Consts.READ, Consts.WRITE];
    }
    return (
      <div>
        {this.renderRequestPermissionButton(requestOptions)}
        <div className={styles.spacerSmall} />
        {this.renderDownloadButton(downloadOptions)}
      </div>
    );
  }

  renderPermissionsPanel = (name) => {
    if (this.props.isOwner) {
      return (
        <div className={this.shouldShow[this.state.showPanel]}>
          <PermissionsPanel entitySetName={name} exitPanel={this.exitPanel} />
        </div>
      );
    }
    return null;
  }

  render() {
    const { name, title, type, isOwner } = this.props;
    return (
      <div className={styles.edmContainer}>
        <button onClick={this.changeEditingState} className={this.shouldAllowEditPermissions[this.props.isOwner]}>
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
        {this.renderDownloadOrRequestDropdowns()}
        <br />
        <div className={styles.spacerSmall} />
        {this.renderPermissionsPanel(name)}
        <Visualization entitySetName={name} />
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
          isOwner={isOwner}
        />
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default EntitySet;
