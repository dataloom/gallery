import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { DropdownButton, Button, MenuItem } from 'react-bootstrap';

import { DataApi, EntityDataModelApi, PermissionsApi } from 'loom-data';
import { PropertyList } from '../../../components/propertylist/PropertyList';
import { PermissionsPanel } from '../../../components/permissions/PermissionsPanel';
import PermissionsConsts from '../../../utils/Consts/PermissionsConsts';
import UserRoleConsts from '../../../utils/Consts/UserRoleConsts';
import StringConsts from '../../../utils/Consts/StringConsts';
import FileConsts from '../../../utils/Consts/FileConsts';
import PageConsts from '../../../utils/Consts/PageConsts';
import AuthService from '../../../utils/AuthService';

import styles from '../catalog.module.css';

const permissionLevels = {
  hidden: [],
  discover: [PermissionsConsts.DISCOVER],
  read: [PermissionsConsts.DISCOVER, PermissionsConsts.READ],
  write: [PermissionsConsts.DISCOVER, PermissionsConsts.READ, PermissionsConsts.WRITE]
};

export class EntitySet extends React.Component {

  static contextTypes = {
    router: PropTypes.object
  }

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
      showPanel: false,
      loadEntityTypeError: false,
      permissionRequestStatus: {
        display: styles.hidden,
        msg: ''
      }
    };
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  /* API Calls */
  requestPermission = (type) => {
    PermissionsApi.addPermissionsRequestForPropertyTypesInEntitySet([{
      principal: {
        type: UserRoleConsts.USER,
        id: this.props.auth.getProfile().user_id
      },
      action: PermissionsConsts.REQUEST,
      name: this.props.name,
      permissions: permissionLevels[type]
    }]).then(() => {
      this.setState({
        permissionRequestStatus: {
          display: styles.updateSuccess,
          msg: `You have requested ${type.toLowerCase()} permissions.`
        }
      });
    }).catch(() => {
      this.setState({
        permissionRequestStatus: {
          display: styles.errorMsg,
          msg: `Error: unable to request ${type.toLowerCase()} permissions.`
        }
      });
    });
  }

  componentDidMount() {
    EntityDataModelApi.getEntityType(this.props.type)
    .then((type) => {
      this.setState({
        properties: type.properties,
        loadEntityTypeError: false
      });
    }).catch(() => {
      this.setState({ loadEntityTypeError: true });
    });
  }

  getUrl = (datatype) => {
    return DataApi.getAllEntitiesOfTypeInSetFileUrl(this.props.type, this.props.name, datatype);
  }
  /* Component Logic */

  shouldShow = {
    true: StringConsts.EMPTY,
    false: styles.hidden
  };

  errorClass = {
    true: styles.errorMsg,
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
    const reqStatus = this.state.permissionRequestStatus;
    const permissions = this.props.permissions;
    if (permissions.includes(PermissionsConsts.WRITE)) {
      downloadOptions = [FileConsts.CSV, FileConsts.JSON];
    }
    else if (permissions.includes(PermissionsConsts.READ)) {
      downloadOptions = [FileConsts.CSV, FileConsts.JSON];
      requestOptions = [PermissionsConsts.WRITE.toLowerCase()];
    }
    else {
      requestOptions = [PermissionsConsts.READ.toLowerCase(), PermissionsConsts.WRITE.toLowerCase()];
    }
    return (
      <div>
        <div className={`${reqStatus.display} ${styles.permissionRequestStatusMsg}`}>{reqStatus.msg}</div>
        {this.renderRequestPermissionButton(requestOptions)}
        {this.renderDownloadButton(downloadOptions)}
      </div>
    );
  }

  visualizeButtonClass = () => {
    const permissions = this.props.permissions;
    return (permissions.includes(PermissionsConsts.READ) || permissions.includes(PermissionsConsts.WRITE)) ?
      "" : styles.hidden;
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
    const { properties, editing } = this.state;

    let editButton;
    if (isOwner) {
      editButton = (
        <Button onClick={this.changeEditingState}>
          {(editing) ? 'Stop editing' : 'Edit permissions'}
        </Button>
      );
    }

    return (
      <article className={styles.entitySet}>
        <header>
          <h2 className={styles.title}>
            {name}
            <small>{type.namespace} {type.name}</small>
          </h2>

          <div className={styles.controls}>
            {editButton}
            <DropdownButton title="Actions" id="action-dropdown">
              <MenuItem header>Download</MenuItem>
              <MenuItem href={this.getUrl(FileConsts.CSV)}>CSV</MenuItem>
              <MenuItem href={this.getUrl(FileConsts.JSON)}>JSON</MenuItem>
              <MenuItem divider/>
              <MenuItem>
                <Link
                  to={`/${PageConsts.VISUALIZE}?name=${name}&typeNamespace=${type.namespace}&typeName=${type.name}`}>
                  Visualize
                </Link>
              </MenuItem>
            </DropdownButton>
          </div>
        </header>

        {this.renderPermissionsPanel(name)}
        <div className={this.errorClass[this.state.loadEntityTypeError]}>
          Unable to load entity type details for {name}.
        </div>
        <PropertyList
          properties={properties}
          entityTypeName={type.name}
          entityTypeNamespace={type.namespace}
          allowEdit={false}
          entitySetName={name}
          editingPermissions={editing}
          isOwner={isOwner}
        />
      </article>
    );
  }
}

export default EntitySet;
