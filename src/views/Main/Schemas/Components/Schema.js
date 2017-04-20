import React, { PropTypes } from 'react';
import { SplitButton, MenuItem } from 'react-bootstrap';
import { EntityDataModelApi } from 'loom-data';
import { PropertyList } from './PropertyList';
import FileConsts from '../../../../utils/Consts/FileConsts';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import { EntityTypeFqnList } from './EntityTypeFqnList';
import styles from '../styles.module.css';

export class Schema extends React.Component {
  static propTypes = {
    schema: PropTypes.object,
    updateFn: PropTypes.func
  }

  constructor() {
    super();
    this.state = {
      error: false
    };
  }

  updateSchema = (newTypeUuid, action, type) => {
    if (type === EdmConsts.ENTITY_TYPE) {
      return EntityDataModelApi.updateSchema(this.props.schema.fqn, action, newTypeUuid, [])
      .then(() => {
        this.props.updateFn();
        this.setState({ error: false });
      }).catch(() => {
        this.setState({ error: true });
      });
    }
    return EntityDataModelApi.updateSchema(this.props.schema.fqn, action, [], newTypeUuid)
    .then(() => {
      this.props.updateFn();
      this.setState({ error: false });
    }).catch(() => {
      this.setState({ error: true });
    });
  }

  renderError() {
    if (this.state.error) {
      return (<div className={styles.errorMsg}>Unable to update schema.</div>);
    }
    return null;
  }

  render() {
    const schema = this.props.schema;
    return (
      <div>
        <div className={styles.name}>{`${schema.fqn.namespace}.${schema.fqn.name}`}</div>
        <div className={styles.spacerMed} />
        <div className={styles.dropdownButtonContainer}>
          <SplitButton id="download-schema-button" bsStyle="primary" title="Download options" pullRight>
            <MenuItem eventKey="1" href={EntityDataModelApi.getSchemaFileUrl(schema.fqn, FileConsts.YAML)}>
                Download as .yaml</MenuItem>
            <MenuItem eventKey="2" href={EntityDataModelApi.getSchemaFileUrl(schema.fqn, FileConsts.JSON)}>
                Download as .json</MenuItem>
          </SplitButton>
        </div>
        <div className={styles.spacerMed} />
        <EntityTypeFqnList
            entityTypeFqns={schema.entityTypes}
            updateSchemaFn={this.updateSchema}  />
        <br />
        <div className={styles.spacerMed} />
        <PropertyList
            properties={schema.propertyTypes}
            updateFn={this.updateSchema}
            editingPermissions={false} />
        {this.renderError()}
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default Schema;
