import React, { PropTypes } from 'react';
import { DataApi, EntityDataModelApi, PermissionsApi } from 'loom-data';
import { PropertyList } from './PropertyList';
import { DropdownButton } from './DropdownButton';
import PermissionsConsts from '../../../../utils/Consts/PermissionsConsts';
import UserRoleConsts from '../../../../utils/Consts/UserRoleConsts';
import StringConsts from '../../../../utils/Consts/StringConsts';
import FileConsts from '../../../../utils/Consts/FileConsts';
import PageConsts from '../../../../utils/Consts/PageConsts';
import AuthService from '../../../../utils/AuthService';
import { PermissionsPanel } from './PermissionsPanel';
import styles from '../styles.module.css';

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

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
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

  requestPermission = (type) => {
    PermissionsApi.addPermissionsRequestForPropertyTypesInEntitySet([{
      principal: {
        type: UserRoleConsts.USER,
        name: this.props.auth.getProfile().email
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

  navigateToVisualize = () => {
    const { name, type } = this.props;
    this.context.router.push({
      pathname: `/${PageConsts.VISUALIZE}`,
      query: {
        name,
        typeNamespace: type.namespace,
        typeName: type.name
      }
    });
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
    const { properties, editing } = this.state;
    return (
      <div className={styles.edmContainer}>
        <button onClick={this.changeEditingState} className={this.shouldAllowEditPermissions[isOwner]}>
          {(editing) ? 'Stop editing' : 'Edit permissions'}
        </button>
        <div className={styles.spacerSmall} />
        <div className={styles.name}>{name}</div>
        <div className={styles.spacerLeft} />
        <button
          className={this.shouldShowPermissionButton[editing]}
          onClick={this.editEntitySetPermissions}
        >Change permissions</button>
        <div className={styles.spacerMed} />
        <div className={styles.subtitle}>{title}</div>
        <div className={styles.spacerMed} />
        {this.renderDownloadOrRequestDropdowns()}
        <br />
        <div className={styles.spacerSmall} />
        {this.renderPermissionsPanel(name)}
        <div className={this.errorClass[this.state.loadEntityTypeError]}>
          Unable to load entity type details for {name}.
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
          properties={properties}
          entityTypeName={type.name}
          entityTypeNamespace={type.namespace}
          allowEdit={false}
          entitySetName={name}
          editingPermissions={editing}
          isOwner={isOwner}
        />
        <div className={styles.spacerMed} />
        <button
          className={styles.simpleButton}
          onClick={this.navigateToVisualize}
        >Visualize</button>
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default EntitySet;
