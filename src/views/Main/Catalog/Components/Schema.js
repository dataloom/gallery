import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { PropertyTypeList } from './PropertyTypeList';
import Consts from '../../../../utils/AppConsts';
import FileService from '../../../../utils/FileService';
import { EntityTypeFqnList } from './EntityTypeFqnList';
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
    allEntityTypeNamespaces: PropTypes.object
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
    this.downloadFile(Consts.JSON);
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
    if (datatype === Consts.JSON) {
      this.setState({ disableJson: false });
    }
  }

  render() {
    const { name, namespace, propertyTypes, entityTypeFqns, updateFn } = this.props;
    return (
      <div className={styles.edmContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.descriptionLabel}> (name)</div>
        <br />
        <div className={styles.subtitle}>{namespace}</div>
        <div className={styles.descriptionLabel}> (namespace)</div>
        <br />
        <div className={styles.spacerMed} />
        <div className={styles.tableDescriptionLabel}>Entity Types:</div>
        <EntityTypeFqnList
          entityTypeFqns={entityTypeFqns}
          schemaName={name}
          schemaNamespace={namespace}
          updateFn={updateFn}
          allEntityTypeNamespaces={this.props.allEntityTypeNamespaces}
        />
        <br />
        <div className={styles.spacerMed} />
        <div className={styles.tableDescriptionLabel}>Property Types:</div>
        <PropertyTypeList
          propertyTypes={propertyTypes}
          name={name}
          namespace={namespace}
          updateSchemaFn={updateFn}
          navBar={false}
          allPropNamespaces={this.props.allPropNamespaces}
        />
        <br />
        <Button onClick={this.handleClick} disabled={this.state.disableJson}>Download {name} as JSON</Button>
        <div className={this.state.error}>Unable to download {name}</div>
      </div>
    );
  }
}

export default Schema;
