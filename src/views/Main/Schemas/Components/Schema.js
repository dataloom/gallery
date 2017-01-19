import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { PropertyList } from './PropertyList';
import FileConsts from '../../../../utils/Consts/FileConsts';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import FileService from '../../../../utils/FileService';
import { EntityTypeFqnList } from './EntityTypeFqnList';
import { DropdownButton } from './DropdownButton';
import styles from '../styles.module.css';

export class Schema extends React.Component {
  static propTypes = {
    schema: PropTypes.object,
    updateFn: PropTypes.func,
    allPropNamespaces: PropTypes.object,
    allEntityTypeNamespaces: PropTypes.object,
    entityTypeFqnsToId: PropTypes.object,
    propFqnsToId: PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      error: styles.hidden,
      disableJson: false
    };
  }

  handleClick = () => {
    this.setState({ disableJson: true });
    this.downloadFile(FileConsts.JSON);
  }

  downloadFile = (datatype) => {
    FileService.saveFile(this.props.schema, this.props.schema.fqn.name, datatype, this.enableButton);
  }

  displayError = () => {
    this.setState({
      error: styles.errorMsg,
      disableJson: false
    });
  }

  enableButton = (datatype) => {
    if (datatype === FileConsts.JSON) {
      this.setState({ disableJson: false });
    }
  }

  updateSchema = (newTypeUuid, action, type) => {
    if (type === EdmConsts.ENTITY_TYPE) {
      return EntityDataModelApi.updateSchema(this.props.schema.fqn, action, newTypeUuid, [])
      .then(() => {
        this.props.updateFn();
      });
    }
    return EntityDataModelApi.updateSchema(this.props.schema.fqn, action, [], newTypeUuid)
    .then(() => {
      this.props.updateFn();
    });
  }

  render() {
    const {
      schema,
      allEntityTypeNamespaces,
      allPropNamespaces,
      propFqnsToId,
      entityTypeFqnsToId
    } = this.props;
    const options = [FileConsts.JSON];
    return (
      <div className={styles.edmContainer}>
        <div className={styles.name}>{`${schema.fqn.namespace}.${schema.fqn.name}`}</div>
        <div className={styles.spacerMed} />
        <div className={styles.dropdownButtonContainer}>
          <DropdownButton downloadFn={this.downloadFile} options={options} />
        </div>
        <div className={styles.spacerMed} />
        <EntityTypeFqnList
          entityTypeFqns={schema.entityTypes}
          updateSchemaFn={this.updateSchema}
          allEntityTypeNamespaces={allEntityTypeNamespaces}
          entityTypeFqnsToId={entityTypeFqnsToId}
        />
        <br />
        <div className={styles.spacerMed} />
        <PropertyList
          properties={schema.propertyTypes}
          updateFn={this.updateSchema}
          allPropNamespaces={allPropNamespaces}
          propFqnsToId={propFqnsToId}
          editingPermissions={false}
        />
        <div className={this.state.error}>Unable to download {name}</div>
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default Schema;
