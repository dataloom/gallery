import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import { FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncContent from '../../components/asynccontent/AsyncContent';
import { editAppTypeRequest } from './AppActionFactory';


class EditAppType extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      editAppTypeRequest: PropTypes.func.isRequired
    }).isRequired,
    editAppTypeAsyncState: PropTypes.instanceOf(Immutable.Map).isRequired,
    entityTypeId: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    namespace: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      description: '',
      entityTypeId: '',
      name: '',
      namespace: '',
      title: ''
    };
  }

  onTitleChange = (event) => {
    this.setState({
      title: event.target.value.trim()
    });
  };

  onNameChange = (event) => {
    this.setState({
      name: event.target.value.trim()
    });
  };

  onNamespaceChange = (event) => {
    this.setState({
      namespace: event.target.value.trim()
    });
  };

  onDescriptionChange = (event) => {
    this.setState({
      description: event.target.value.trim()
    });
  };

  onEntityTypeIdChange = (event) => {
    this.setState({
      entityTypeId: event.target.value.trim()
    });
  };

  onSubmit = () => {
    // TODO: Utilize Models and Model Builders
    const { title, description, name, namespace, entityTypeId } = this.state;
    const appTypeData = {};
    const appTypeId = this.props.id;

    // Collect only items that have been changed. AKA NOT an empty string.
    if (title && title.length > 0) {
      appTypeData.title = title;
    }
    if (description && description.length > 0) {
      appTypeData.description = description;
    }
    if (name && name.length > 0 && namespace && namespace.length > 0) {
      appTypeData.type = {
        namespace,
        name
      };
    }
    if (name && name.length > 0 && (!namespace || !namespace.length > 0)) {
      appTypeData.type = {
        'namespace': this.props.namespace,
        name
      };
    }
    if (namespace && namespace.length > 0 && (!name || !name.length > 0)) {
      appTypeData.type = {
        namespace,
        'name': this.props.name
      };
    }
    if (entityTypeId && entityTypeId.length > 0) {
      appTypeData.entityTypeId = entityTypeId;
    }

    this.props.actions.editAppTypeRequest(appTypeId, appTypeData);
  }

  renderPending = () => {
    return (
      <form onSubmit={this.onSubmit}>
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl type="text" onChange={this.onNameChange} placeholder={this.props.name} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Namespace</ControlLabel>
          <FormControl type="text" onChange={this.onNamespaceChange} placeholder={this.props.namespace} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <FormControl type="text" onChange={this.onTitleChange} placeholder={this.props.title} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl componentClass="textarea" onChange={this.onDescriptionChange} placeholder={this.props.description} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Entity Type Id</ControlLabel>
          <FormControl type="text" onChange={this.onEntityTypeIdChange} placeholder={this.props.entityTypeId} />
        </FormGroup>

        <br />
        <Button type="submit" bsStyle="primary">Update App</Button>
      </form>
    );
  };

  renderSuccess = () => {
    return (
      <Alert bsStyle="success">
        Successfully saved changes
      </Alert>
    );
  };

  render() {
    return (
      <AsyncContent
          content={this.renderSuccess}
          errorMessage={this.props.editAppTypeAsyncState.get('errorMessage')}
          pendingContent={this.renderPending()}
          status={this.props.editAppTypeAsyncState.get('status')} />
    );
  }

}

function mapStateToProps(state) {
  const editAppTypeAsyncState = state.getIn(['app', 'editAppTypeAsyncState']);

  return {
    editAppTypeAsyncState
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    editAppTypeRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAppType);
