import React, { PropTypes } from 'react';
import { SplitButton, MenuItem } from 'react-bootstrap';
import { EntityDataModelApi } from 'lattice';
import { PropertyList } from './PropertyList';
import FileConsts from '../../../../utils/Consts/FileConsts';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import { EntityTypeFqnList } from './EntityTypeFqnList';
import { AssociationTypeFqnList } from './AssociationTypeFqnList';
import styles from '../styles.module.css';

export class Schema extends React.Component {
  static propTypes = {
    schema: PropTypes.object,
    updateFn: PropTypes.func,
    associationTypes: PropTypes.array,
    searchAssocationTypesFn: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = Object.assign(this.getEntityAndAssociationTypes(props), {
      error: false,
      searchFn: this.getSearchFn(props.associationTypes)
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(Object.assign(this.getEntityAndAssociationTypes(nextProps), {
      searchFn: this.getSearchFn(nextProps.associationTypes)
    }));
  }

  getEntityAndAssociationTypes = (props) => {
    const associationTypeIds = props.associationTypes.map((associationType) => {
      return associationType.id;
    });
    const entityTypes = [];
    const associationTypes = [];
    props.schema.entityTypes.forEach((entityType) => {
      if (associationTypeIds.includes(entityType.id)) associationTypes.push(entityType);
      else entityTypes.push(entityType);
    });
    return { associationTypeIds, associationTypes, entityTypes };
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

  constainsSubstr = (str, substr) => {
    return str.toLowerCase().includes(substr.toLowerCase());
  }

  getSearchFn = (associationTypes) => {
    return (searchObj) => {
      const { namespace, name } = searchObj;
      const results = [];
      associationTypes.forEach((associationType) => {
        const fqn = associationType.type;
        if (this.constainsSubstr(fqn.namespace, namespace) && this.constainsSubstr(fqn.name, name)) results.push(associationType);
      });
      return Promise.resolve({ hits: results });
    }
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
            entityTypeFqns={this.state.entityTypes}
            updateSchemaFn={this.updateSchema}  />
        <br />
        <div className={styles.spacerMed} />
        <AssociationTypeFqnList
            associationTypes={this.props.associationTypes}
            associationTypeFqns={this.state.associationTypes}
            updateSchemaFn={this.updateSchema}
            searchFn={this.state.searchFn} />
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
