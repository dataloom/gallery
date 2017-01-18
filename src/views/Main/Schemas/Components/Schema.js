import React, { PropTypes } from 'react';
import { EntityDataModelApi, DataModels } from 'loom-data';
import { PropertyTypeList } from './PropertyTypeList';
import FileConsts from '../../../../utils/Consts/FileConsts';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import FileService from '../../../../utils/FileService';
import { EntityTypeFqnList } from './EntityTypeFqnList';
import { DropdownButton } from '../../../../components/dropdown/DropdownButton';
import styles from '../styles.module.css';

export class Schema extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    propertyTypes: PropTypes.array,
    entityTypeFqns: PropTypes.array,
    jsonContents: PropTypes.object,
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
    FileService.saveFile(this.props.jsonContents, this.props.name, datatype, this.enableButton);
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
    const { FullyQualifiedName } = DataModels;
    const schemaFqn = new FullyQualifiedName(this.props.namespace, this.props.name);
    if (type === EdmConsts.ENTITY_TYPE) {
      return EntityDataModelApi.updateSchema(schemaFqn, action, newTypeUuid, [])
      .then(() => {
        this.props.updateFn();
      });
    }
    return EntityDataModelApi.updateSchema(schemaFqn, action, [], newTypeUuid)
    .then(() => {
      this.props.updateFn();
    });
  }

  render() {
    const {
      name,
      namespace,
      propertyTypes,
      entityTypeFqns,
      allEntityTypeNamespaces,
      allPropNamespaces,
      propFqnsToId,
      entityTypeFqnsToId
    } = this.props;
    const options = [FileConsts.JSON];
    return (
      <div className={styles.edmContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.spacerSmall} />
        <div className={styles.subtitle}>{namespace}</div>
        <div className={styles.spacerMed} />
        <div className={styles.dropdownButtonContainer}>
          <DropdownButton downloadFn={this.downloadFile} options={options} />
        </div>
        <div className={styles.spacerMed} />
        <EntityTypeFqnList
          entityTypeFqns={entityTypeFqns}
          updateSchemaFn={this.updateSchema}
          allEntityTypeNamespaces={allEntityTypeNamespaces}
          entityTypeFqnsToId={entityTypeFqnsToId}
        />
        <br />
        <div className={styles.spacerMed} />
        <PropertyTypeList
          propertyTypes={propertyTypes}
          name={name}
          namespace={namespace}
          updateSchemaFn={this.updateSchema}
          propertyTypePage={false}
          allPropNamespaces={allPropNamespaces}
          propFqnsToId={propFqnsToId}
        />
        <div className={this.state.error}>Unable to download {name}</div>
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default Schema;
