import React, { PropTypes } from 'react';
import { FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import Select from 'react-select';
import classnames from 'classnames';
import { connect } from 'react-redux';

import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import * as edmActionFactories from '../edm/EdmActionFactories';
import * as actionFactories from './CreateEntitySetActionFactories';
import { getEdmObjectsShallow } from '../edm/EdmStorage';
import { EntityTypePropType } from '../edm/EdmModel';

class CreateEntitySet extends React.Component {
  static propTypes = {
    createEntitySetAsyncState: AsyncStatePropType.isRequired,
    onCreate: PropTypes.func.isRequired,
    loadEntityTypes: PropTypes.func.isRequired,
    entityTypes: PropTypes.arrayOf(EntityTypePropType).isRequired,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      name: '',
      entityTypeId: null
    }
  }

  componentDidMount() {
    this.props.loadEntityTypes();
  }

  onTitleChange = (event) => {
    this.setState({
      title: event.target.value
    });
  };

  onNameChange = (event) => {
    this.setState({
      name: event.target.value
    });
  };

  onDescriptionChange = (event) => {
    this.setState({
      description: event.target.value
    });
  };

  onEntityTypeChange = (option) => {
    this.setState({
      entityTypeId: option.value
    });
  };

  onSubmit = () => {
    const { title, name, description, entityTypeId } = this.state;

    this.props.onCreate({
      title,
      name,
      description,
      entityTypeId
    });
  };

  getEntityTypeOptions() {
    return this.props.entityTypes.map(entityType => {
      return {
        value: entityType.id,
        label: entityType.title
      };
    });
  }

  renderPending = () => {
    return (
      <form onSubmit={this.onSubmit} className={classnames(this.props.className)}>
        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <FormControl type="text" onChange={this.onTitleChange}/>
        </FormGroup>


        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl type="text" onChange={this.onNameChange}/>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl componentClass="textarea" onChange={this.onDescriptionChange}/>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Entity type</ControlLabel>
          <Select
            value={this.state.entityTypeId}
            options={this.getEntityTypeOptions()}
            onChange={this.onEntityTypeChange}
          />
        </FormGroup>
        <Button type="submit" bsStyle="primary">Create</Button>
      </form>
    );
  };

  renderSuccess = () => {
    return (
      <Alert bsStyle="success">
        Successfully saved Datasource
      </Alert>
    );
  };

  render() {
    return (
      <AsyncContent
        {...this.props.createEntitySetAsyncState}
        pendingContent={this.renderPending()}
        content={this.renderSuccess}
      />
    );
  }
}

function mapStateToProps(state) {
  const normalizedData = state.get('normalizedData').toJS(),
    createEntitySetState = state.get('createEntitySet').toJS();
  return {
    entityTypes: getEdmObjectsShallow(normalizedData, createEntitySetState.entityTypeReferences),
    createEntitySetAsyncState: createEntitySetState.createEntitySetAsyncState
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    onCreate: (entitySet) => { dispatch(actionFactories.createEntitySetRequest(entitySet)); },
    loadEntityTypes: () => { dispatch(edmActionFactories.allEntityTypesRequest()); }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEntitySet);