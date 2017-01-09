// @flow

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { DropdownButton, Button, MenuItem } from 'react-bootstrap';

import { DataApi, EntityDataModelApi, PermissionsApi } from 'loom-data';

import { PropertyList } from '../propertylist/PropertyList';
import { PermissionsPanel } from '../permissions/PermissionsPanel';
import StringConsts from '../../utils/Consts/StringConsts';
import FileConsts from '../../utils/Consts/FileConsts';
import PageConsts from '../../utils/Consts/PageConsts';
import { Permission } from '../../core/permissions/Permission';
import styles from '../../containers/catalog/catalog.module.css';

export class EntitySet extends React.Component {
  static propTypes = {
    // TODO: Use flow to specify types
    entitySet: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      editing: false,
      showPanel: false,
      permissionRequestStatus: {
        display: styles.hidden,
        msg: ''
      }
    };
  }

  /* Component Logic */
  getUrl(datatype) {
    let entitySet = this.props.entitySet;
    return DataApi.getAllEntitiesOfTypeInSetFileUrl(entitySet.type, entitySet.name, datatype);
  }

  shouldShow = {
    true: StringConsts.EMPTY,
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


  renderPermissionsPanel = (name) => {
    if (this.props.isOwner) {
      return (
        <div className={this.shouldShow[this.state.showPanel]}>
          <PermissionsPanel entitySetName={name} exitPanel={this.exitPanel} />
        </div>
      );
    }
    return null;
  };

  render() {
    const { entitySet } = this.props;
    const { editing } = this.state;

    let isOwner = entitySet.permission.hasPermission(Permission.OWNER);
    let type = entitySet.type;

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
            <small>{type.namespace} {type.title}</small>
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
        <PropertyList
          properties={entitySet.properties}
          entityTypeName={type.name}
          entityTypeNamespace={type.namespace}
          allowEdit={false}
          entitySetName={entitySet.name}
          editingPermissions={editing}
          isOwner={isOwner}
        />
      </article>
    );
  }
}

export default EntitySet;
