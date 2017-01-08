// @flow

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { DropdownButton, Button, MenuItem } from 'react-bootstrap';

import { DataApi, EntityDataModelApi, PermissionsApi } from 'loom-data';
import { PropertyList } from '../../../components/propertylist/PropertyList';
import { PermissionsPanel } from '../../../components/permissions/PermissionsPanel';
import StringConsts from '../../../utils/Consts/StringConsts';
import FileConsts from '../../../utils/Consts/FileConsts';
import PageConsts from '../../../utils/Consts/PageConsts';

import styles from '../catalog.module.css';

export class EntitySet extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.object,
    isOwner: PropTypes.bool
  };

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

  /* API Calls */
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
