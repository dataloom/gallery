import React, { PropTypes } from 'react';
import Select from 'react-select';

import {
  FormControl,
  FormGroup,
  ControlLabel,
  Button,
  Checkbox
} from 'react-bootstrap';

import {
  EntityDataModelApi,
  DataModels,
  SearchApi,
  Types
} from 'loom-data';

import StringConsts from '../../../../utils/Consts/StringConsts';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import DeleteButton from '../../../../components/buttons/DeleteButton';
import styles from '../styles.module.css';

import {
  NameNamespaceAutosuggest
} from './NameNamespaceAutosuggest';

const NAME_FIELD = 'name';
const NAMESPACE_FIELD = 'namespace';
const TITLE_FIELD = 'title';
const DESCRIPTION_FIELD = 'description';
const BIDIRECTIONAL_FIELD = 'bidirectional';

const INITIAL_STATE = {
  [NAME_FIELD]: StringConsts.EMPTY,
  [NAMESPACE_FIELD]: StringConsts.EMPTY,
  [TITLE_FIELD]: StringConsts.EMPTY,
  [DESCRIPTION_FIELD]: StringConsts.EMPTY,
  [BIDIRECTIONAL_FIELD]: false,
  propertyTypes: [],
  pKeys: [],
  typeName: StringConsts.EMPTY,
  typeNamespace: StringConsts.EMPTY,
  datatype: StringConsts.EMPTY,
  pii: false,
  error: false,
  phonetic: false,
  srcEntityTypes: [],
  dstEntityTypes: [],
  srcTypeName: StringConsts.EMPTY,
  srcTypeNamespace: StringConsts.EMPTY,
  dstTypeName: StringConsts.EMPTY,
  dstTypeNamespace: StringConsts.EMPTY,
};

const STRING = 'String';
const { SecurableTypes } = Types;

export class NewEdmObjectInput extends React.Component {

  static propTypes = {
    createSuccess: PropTypes.func,
    edmType: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  addPropertyTypeToList = () => {
    const type = {
      namespace: this.state.typeNamespace,
      name: this.state.typeName
    };
    EntityDataModelApi.getPropertyTypeId(type)
    .then((id) => {
      const newPropertyType = { type, id };
      const propertyTypes = this.state.propertyTypes;
      propertyTypes.push(newPropertyType);
      this.setState({
        propertyTypes,
        typeNamespace: StringConsts.EMPTY,
        typeName: StringConsts.EMPTY
      });
    });
  }

  addSrcEntityTypeToList = () => {
    const type = {
      namespace: this.state.srcTypeNamespace,
      name: this.state.srcTypeName
    };
    EntityDataModelApi.getEntityTypeId(type)
    .then((id) => {
      const newEntityType = { type, id };
      const srcEntityTypes = this.state.srcEntityTypes;
      srcEntityTypes.push(newEntityType);
      this.setState({
        srcEntityTypes,
        srcTypeNamspace: StringConsts.EMPTY,
        srcTypeName: StringConsts.EMPTY
      });
    });
  }

  addDstEntityTypeToList = () => {
    const type = {
      namespace: this.state.dstTypeNamespace,
      name: this.state.dstTypeName
    };
    EntityDataModelApi.getEntityTypeId(type)
    .then((id) => {
      const newEntityType = { type, id };
      const dstEntityTypes = this.state.dstEntityTypes;
      dstEntityTypes.push(newEntityType);
      this.setState({
        dstEntityTypes,
        dstTypeNamspace: StringConsts.EMPTY,
        dstTypeName: StringConsts.EMPTY
      });
    });
  }

  removePropertyTypeFromList = (propertyTypeToDelete) => {
    const propertyTypes = this.state.propertyTypes.filter((propertyType) => {
      return propertyType.id !== propertyTypeToDelete.id;
    });
    const pKeys = this.state.pKeys.filter((pKey) => {
      return pKey !== propertyTypeToDelete.id;
    });
    this.setState({ propertyTypes, pKeys });
  }

  removeEntityTypeFromList = (entityTypeToDelete, field) => {
    let { srcEntityTypes, dstEntityTypes } = this.state;
    if (field === EdmConsts.ASSOCIATION_TYPE_FIELDS.src) {
      srcEntityTypes = srcEntityTypes.filter((entityType) => {
        return entityType.id !== entityTypeToDelete.id;
      });
    }
    else if (field === EdmConsts.ASSOCIATION_TYPE_FIELDS.dst) {
      dstEntityTypes = dstEntityTypes.filter((entityType) => {
        return entityType.id !== entityTypeToDelete.id;
      });
    }
    this.setState({ srcEntityTypes, dstEntityTypes });
  }

  handleInputChange = (e) => {

    const fieldName = e.target.name;
    this.setState({
      [fieldName]: e.target.value
    });
  }

  handlePropFQNChange = (newValue) => {
    this.setState({
      typeNamespace: newValue.namespace,
      typeName: newValue.name
    });
  }

  handleSrcFQNChange = (newValue) => {
    this.setState({
      srcTypeNamespace: newValue.namespace,
      srcTypeName: newValue.name
    });
  }

  handleDstFQNChange = (newValue) => {
    this.setState({
      dstTypeNamespace: newValue.namespace,
      dstTypeName: newValue.name
    });
  }

  handleDatatypeChange = (e) => {
    const datatype = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    const phonetic = (datatype === STRING) ? this.state.phonetic : false;
    this.setState({ datatype, phonetic });
  }

  createNewEdmObject = () => {
    this.createNewObjectForEdmType()
    .then(() => {
      this.props.createSuccess();
      this.setState(INITIAL_STATE);
    }).catch(() => {
      this.setState({ error: true });
    });
  }

  createNewObjectForEdmType = () => {
    const { FullyQualifiedName, EntityTypeBuilder, PropertyTypeBuilder } = DataModels;
    const fqn = new FullyQualifiedName({
      namespace: this.state[NAMESPACE_FIELD],
      name: this.state[NAME_FIELD]
    });

    switch (this.props.edmType) {
      case EdmConsts.SCHEMA_TITLE: {
        return EntityDataModelApi.createEmptySchema(fqn);
      }
      case EdmConsts.ENTITY_TYPE_TITLE: {
        const propertyTypes = this.state.propertyTypes.map((propertyType) => {
          return propertyType.id;
        });
        const entityType = new EntityTypeBuilder()
          .setType(fqn)
          .setTitle(this.state[TITLE_FIELD])
          .setDescription(this.state[DESCRIPTION_FIELD])
          .setPropertyTypes(propertyTypes)
          .setKey(this.state.pKeys)
          .setCategory(SecurableTypes.EntityType)
          .build();
        return EntityDataModelApi.createEntityType(entityType);
      }
      case EdmConsts.ASSOCIATION_TYPE_TITLE: {
        const propertyTypes = this.state.propertyTypes.map((propertyType) => {
          return propertyType.id;
        });
        const src = this.state.srcEntityTypes.map((entityType) => {
          return entityType.id;
        });
        const dst = this.state.dstEntityTypes.map((entityType) => {
          return entityType.id;
        });
        const entityType = new EntityTypeBuilder()
          .setType(fqn)
          .setTitle(this.state[TITLE_FIELD])
          .setDescription(this.state[DESCRIPTION_FIELD])
          .setPropertyTypes(propertyTypes)
          .setKey(this.state.pKeys)
          .setCategory(SecurableTypes.AssociationType)
          .build();
        const associationType = {
          entityType,
          src,
          dst,
          bidirectional: this.state.bidirectional
        };
        return EntityDataModelApi.createAssociationType(associationType);
      }
      case EdmConsts.PROPERTY_TYPE_TITLE: {
        const propertyType = new PropertyTypeBuilder()
          .setType(fqn)
          .setTitle(this.state[TITLE_FIELD])
          .setDescription(this.state[DESCRIPTION_FIELD])
          .setDataType(this.state.datatype)
          .build();
        propertyType.piiField = this.state.pii;
        propertyType.analyzer = (this.state.datatype === STRING && this.state.phonetic) ?
          EdmConsts.ANALYZERS.metaphone : EdmConsts.ANALYZERS.standard;
        return EntityDataModelApi.createPropertyType(propertyType);
      }
      default:
        return Promise.resolve();
    }
  }

  toggleCheckbox = (propertyTypeId) => {
    const checked = !this.state.pKeys.includes(propertyTypeId);
    const pKeys = this.state.pKeys.filter((id) => {
      return id !== propertyTypeId;
    });
    if (checked) pKeys.push(propertyTypeId);
    this.setState({ pKeys });
  }

  renderPrimaryKeyCheckbox = (propertyType) => {
    return (
      <input
          type="checkbox"
          checked={this.state.pKeys.includes(propertyType.id)}
          onClick={() => {
            this.toggleCheckbox(propertyType.id);
          }} />
    );
  }

  renderPropertyTypesAdded = () => {
    if (this.props.edmType !== EdmConsts.ENTITY_TYPE_TITLE
      && this.props.edmType !== EdmConsts.ASSOCIATION_TYPE_TITLE) return null;
    return this.state.propertyTypes.map((propertyType) => {
      return (
        <tr key={`${propertyType.type.namespace}.${propertyType.type.name}`}>
          <td>
            <DeleteButton
                onClick={() => {
                  this.removePropertyTypeFromList(propertyType);
                }} />
          </td>
          <td className={styles.newEdmCell}>{propertyType.type.name}</td>
          <td className={styles.newEdmCell}>{propertyType.type.namespace}</td>
          <td className={styles.newEdmCell}>{this.renderPrimaryKeyCheckbox(propertyType)}</td>
        </tr>
      );
    });
  }

  renderEntityTypeAdded = (entityType, field) => {
    return (
      <tr key={`${entityType.type.namespace}.${entityType.type.name}-${field}`}>
        <td>
          <DeleteButton
              onClick={() => {
                this.removeEntityTypeFromList(entityType, field);
              }} />
        </td>
        <td className={styles.newEdmCell}>{entityType.type.name}</td>
        <td className={styles.newEdmCell}>{entityType.type.namespace}</td>
      </tr>
    );
  }

  renderSrcEntityTypesAdded = () => {
    if (this.props.edmType !== EdmConsts.ASSOCIATION_TYPE_TITLE) return null;
    return this.state.srcEntityTypes.map((entityType) => {
      return this.renderEntityTypeAdded(entityType, EdmConsts.ASSOCIATION_TYPE_FIELDS.src);
    });
  }

  renderDstEntityTypesAdded = () => {
    if (this.props.edmType !== EdmConsts.ASSOCIATION_TYPE_TITLE) return null;
    return this.state.dstEntityTypes.map((entityType) => {
      return this.renderEntityTypeAdded(entityType, EdmConsts.ASSOCIATION_TYPE_FIELDS.dst);
    });
  }

  renderInputField = (fieldType, fieldName) => {
    return (
      <FormGroup>
        <ControlLabel>{`${this.props.edmType} ${fieldType}`}</ControlLabel>
        <FormControl
            type="text"
            value={this.state[fieldName]}
            name={fieldName}
            placeholder={fieldName}
            onChange={this.handleInputChange} />
        <div className={styles.spacerSmall} />
      </FormGroup>
    );
  }

  renderInputCheckbox = (checkboxType, fieldName) => {
    return (
      <Checkbox
          checked={this.state[fieldName]}
          onChange={(e) => {
            this.setState({ [fieldName]: e.target.checked });
          }}>{checkboxType}
      </Checkbox>
    );
  }

  renderInputFieldsForEdmType = () => {
    switch (this.props.edmType) {
      case EdmConsts.SCHEMA_TITLE:
      case EdmConsts.ENTITY_TYPE_TITLE:
        return (
          <div>
            {this.renderInputField('Title', TITLE_FIELD)}
            {this.renderInputField('Namespace', NAMESPACE_FIELD)}
            {this.renderInputField('Name', NAME_FIELD)}
            {this.renderInputField('Description', DESCRIPTION_FIELD)}
          </div>
        );
      case EdmConsts.PROPERTY_TYPE_TITLE:
        return (
          <div>
            {this.renderInputField('Title', TITLE_FIELD)}
            {this.renderInputField('Namespace', NAMESPACE_FIELD)}
            {this.renderInputField('Name', NAME_FIELD)}
            {this.renderInputField('Description', DESCRIPTION_FIELD)}
          </div>
        );
      case EdmConsts.ASSOCIATION_TYPE_TITLE:
        return (
          <div>
            {this.renderInputField('Title', TITLE_FIELD)}
            {this.renderInputField('Namespace', NAMESPACE_FIELD)}
            {this.renderInputField('Name', NAME_FIELD)}
            {this.renderInputField('Description', DESCRIPTION_FIELD)}
            {this.renderInputCheckbox('Bidirectional', BIDIRECTIONAL_FIELD)}
          </div>
        );
      default:
        return null;
    }
  }

  renderPiiDropdown = () => {
    const options = [
      { value: true, label: 'True' },
      { value: false, label: 'False' }
    ];
    return (
      <div>
        <div>PII</div>
        <div className={styles.spacerMini} />
        <Select
            value={this.state.pii}
            onChange={this.handlePiiChange}
            options={options}
            className={styles.piiSelect} />
        <div className={styles.spacerSmall} />
      </div>
    );
  }

  handlePiiChange = (e) => {
    const newValue = (e) ? e.value : false;
    this.setState({ pii: newValue });
  }

  renderInputFqnAutosuggest = () => {
    const { edmType } = this.props;
    const { propertyTypes, typeName, typeNamespace } = this.state;
    if (edmType !== EdmConsts.ENTITY_TYPE_TITLE && edmType !== EdmConsts.ASSOCIATION_TYPE_TITLE) return null;
    const propertyTypeClassName = (edmType === EdmConsts.ENTITY_TYPE_TITLE
      || edmType === EdmConsts.ASSOCIATION_TYPE_TITLE) ? StringConsts.EMPTY : styles.hidden;
    const usedProperties = propertyTypes.map((propertyType) => {
      return propertyType.id;
    });
    return (
      <div>
        <div className={propertyTypeClassName}>Property Types:</div>
        <table>
          <tbody>
            <tr className={propertyTypeClassName}>
              <th />
              <th className={styles.newEdmCell}>Namespace</th>
              <th className={styles.newEdmCell}>Name</th>
              <th className={styles.newEdmCell}>Primary Key</th>
            </tr>
            {this.renderPropertyTypesAdded()}
            <NameNamespaceAutosuggest
                searchFn={SearchApi.searchPropertyTypesByFQN}
                usedProperties={usedProperties}
                addProperty={this.addPropertyTypeToList}
                onFQNChange={this.handlePropFQNChange}
                initialName={typeName}
                initialNamespace={typeNamespace} />
          </tbody>
        </table>
      </div>
    );
  }

  renderInputEntityTypeFqnAutosuggest = () => {
    const { edmType } = this.props;
    const { srcEntityTypes, dstEntityTypes, typeName, typeNamespace } = this.state;
    if (edmType !== EdmConsts.ASSOCIATION_TYPE_TITLE) return null;
    const entityTypeClassName = (edmType === EdmConsts.ASSOCIATION_TYPE_TITLE) ? StringConsts.EMPTY : styles.hidden;
    const usedSrc = srcEntityTypes.map((entityType) => {
      return entityType.id;
    });
    const usedDst = dstEntityTypes.map((entityType) => {
      return entityType.id;
    });
    return (
      <div>
        <div className={entityTypeClassName}>Src Entity Types:</div>
        <table>
          <tbody>
            <tr className={entityTypeClassName}>
              <th />
              <th className={styles.newEdmCell}>Namespace</th>
              <th className={styles.newEdmCell}>Name</th>
            </tr>
            {this.renderSrcEntityTypesAdded()}
            <NameNamespaceAutosuggest
                searchFn={SearchApi.searchEntityTypesByFQN}
                usedProperties={usedSrc}
                addProperty={this.addSrcEntityTypeToList}
                onFQNChange={this.handleSrcFQNChange}
                initialName={typeName}
                initialNamespace={typeNamespace} />
          </tbody>
        </table>
        <div className={entityTypeClassName}>Dst Entity Types:</div>
        <table>
          <tbody>
            <tr className={entityTypeClassName}>
              <th />
              <th className={styles.newEdmCell}>Namespace</th>
              <th className={styles.newEdmCell}>Name</th>
            </tr>
            {this.renderDstEntityTypesAdded()}
            <NameNamespaceAutosuggest
                searchFn={SearchApi.searchEntityTypesByFQN}
                usedProperties={usedDst}
                addProperty={this.addDstEntityTypeToList}
                onFQNChange={this.handleDstFQNChange}
                initialName={typeName}
                initialNamespace={typeNamespace} />
          </tbody>
        </table>
      </div>
    );
  }

  handlePhoneticChange = (e) => {
    this.setState({ phonetic: e.target.checked });
  }

  renderAllowPhonetic = () => {
    if (this.state.datatype !== STRING) return null;
    return (
      <div>
        <label htmlFor="phonetic" className={styles.label}>Allow phonetic searches: </label>
        <input type="checkbox" id="phonetic" onChange={this.handlePhoneticChange} />
        <div className={styles.spacerSmall} />
      </div>
    );
  }

  renderInputDatatypeAutosuggest = () => {
    if (this.props.edmType !== EdmConsts.PROPERTY_TYPE_TITLE) return null;
    return (
      <div>
        <div>Datatype:</div>
        <Select
            value={this.state.datatype}
            onChange={this.handleDatatypeChange}
            options={EdmConsts.EDM_PRIMITIVE_TYPES}
            placeholder="datatype"
            className={styles.datatypeSelect} />
        <div className={styles.spacerSmall} />
        {this.renderAllowPhonetic()}
      </div>
    );
  }

  renderInput = () => {
    return (
      <div>
        {this.renderInputFieldsForEdmType()}
        {this.renderInputFqnAutosuggest()}
        {this.renderInputEntityTypeFqnAutosuggest()}
        {this.renderInputDatatypeAutosuggest()}
        <Button bsStyle="primary" onClick={this.createNewEdmObject}>Create</Button>
      </div>
    );
  }

  render() {
    const errorClassName = (this.state.error) ? styles.errorMsg : styles.hidden;
    return (
      <div>
        <form
            onSubmit={(e) => {
              e.preventDefault();
            }} >
          {this.renderInput()}
        </form>
        <div className={errorClassName}>Unable to create {this.props.edmType.toLowerCase()}.</div>
      </div>
    );
  }
}

export default NewEdmObjectInput;
