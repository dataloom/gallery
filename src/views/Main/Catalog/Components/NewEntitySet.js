import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { InputField } from './InputField';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import StringConsts from '../../../../utils/Consts/StringConsts';
import styles from '../styles.module.css';

const NAME_FIELD = 'name';
const TITLE_FIELD = 'title';

const INITIAL_STATE = {
  [NAME_FIELD]: StringConsts.EMPTY,
  [TITLE_FIELD]: StringConsts.EMPTY,
  typeName: StringConsts.EMPTY,
  typeNamespace: StringConsts.EMPTY,
  editing: false,
  error: false
};

export class NewEntitySet extends React.Component {

  static propTypes = {
    createSuccess: PropTypes.func,
    allTypes: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.state = Object.assign(INITIAL_STATE, this.loadNamespaces(props.allTypes));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(Object.assign(INITIAL_STATE, this.loadNamespaces(nextProps.allTypes)));
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  loadNamespaces = (entityTypes) => {
    const allTypeNamespaces = {};
    entityTypes.forEach((type) => {
      if (allTypeNamespaces[type.namespace] === undefined) {
        allTypeNamespaces[type.namespace] = [type.name];
      }
      else {
        allTypeNamespaces[type.namespace].push(type.name);
      }
    });
    return { namespaces: allTypeNamespaces };
  }

  handleInputChange = (newState) => {
    this.setState(newState);
  }

  handleTypeNamespaceChange = (newValue) => {
    this.setState({ typeNamespace: newValue });
  }

  handleTypeNameChange = (newValue) => {
    this.setState({ typeName: newValue });
  }

  setEditing = () => {
    this.setState({ editing: true });
  }

  createNewEntitySet = () => {
    EntityDataModelApi.createEntitySets([{
      name: this.state[NAME_FIELD],
      title: this.state[TITLE_FIELD],
      type: {
        name: this.state.typeName,
        namespace: this.state.typeNamespace
      }
    }]).then(() => {
      this.props.createSuccess();
      this.setState(INITIAL_STATE);
    }).catch(() => {
      this.setState({ error: true });
    });
  }

  renderButton = () => {
    const className = (this.state.editing) ? styles.hidden : styles.genericButton;
    return (
      <button
        onClick={this.setEditing}
        className={className}
      >Create a new entity set
      </button>
    );
  }

  renderInput = () => {
    const className = (this.state.editing) ? StringConsts.EMPTY : styles.hidden;
    return (
      <div className={className}>
        <InputField
          title="Entity Set Name"
          name={NAME_FIELD}
          value={this.state[NAME_FIELD]}
          updateFn={this.handleInputChange}
        />
        <InputField
          title="Entity Set Title"
          name={TITLE_FIELD}
          value={this.state[TITLE_FIELD]}
          updateFn={this.handleInputChange}
        />
        <table>
          <tbody>
            <NameNamespaceAutosuggest
              namespaces={this.state.namespaces}
              usedProperties={[]}
              noSaveButton
              onNameChange={this.handleTypeNameChange}
              onNamespaceChange={this.handleTypeNamespaceChange}
              initialName={this.state.typeName}
              initialNamespace={this.state.typeNamespace}
            />
          </tbody>
        </table>
        <button className={styles.genericButton} onClick={this.createNewEntitySet}>Create</button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderButton()}
        {this.renderInput()}
        <div className={this.errorClass[this.state.error]}>Unable to create entity set.</div>
        <div className={styles.spacerBig} />
      </div>
    );
  }
}

export default NewEntitySet;
