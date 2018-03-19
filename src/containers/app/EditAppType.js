import React from 'react';
import PropTypes from 'prop-types';

import { FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import { editAppTypeRequest } from './AppActionFactory';


class EditAppType extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      onEditAppType: PropTypes.func.isRequired
    }).isRequired,
    editAppTypeAsyncState: AsyncStatePropType.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    namespace: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    entityTypeId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      name: '',
      namespace: '',
      entityTypeId: ''
    };
  }

  componentDidMount() {
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

  onNamespaceChange = (event) => {
    this.setState({
      namespace: event.target.value
    });
  };

  onDescriptionChange = (event) => {
    this.setState({
      description: event.target.value
    });
  };

  onEntityTypeIdChange = (event) => {
    this.setState({
      entityTypeId: event.target.value
    });
  };

  onSubmit = () => {
    const { title, description, name, namespace, entityTypeId } = this.state;

    // We need to collect only items that have been changed. AKA NOT an empty string.
    // Having issues with this because of js and iterables.
    // Collect the items, check each for change, add changed to appData object.
    const tempMap = new Map([['title', title], ['description', description], ['name', name], ['namespace', namespace], ['entityTypeId', entityTypeId]]);
    const keys = tempMap.keys();
    const appTypeData = {};

    for (const item of keys) {
      if (tempMap.get(item) !== '') {
        appTypeData[item] = tempMap.get(item);
      }
    }

    const appTypeId = this.props.id;
    // Now i need to detect if name or namespace was changed
    if (appTypeData.name && appTypeData.namespace) {
      appTypeData.type = {
        'namespace': appTypeData.namespace,
        'name': appTypeData.name
      };
      delete appTypeData.name;
      delete appTypeData.namespace;
    } else if (appTypeData.name) {
      appTypeData.type = {
        'namespace': this.props.namespace,
        'name': appTypeData.name
      };
      delete appTypeData.name;
    } else if (appTypeData.namespace) {
      appTypeData.type = {
        'namespace': appTypeData.namespace,
        'name': this.props.name
      };
      delete appTypeData.namespace;
    }

    this.props.actions.onEditAppType(appTypeId, appTypeData);
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
          {...this.props.editAppTypeAsyncState}
          pendingContent={this.renderPending()}
          content={this.renderSuccess} />
    );
  }

}

function mapStateToProps(state) {
  const editAppTypeState = state.get('editAppType').toJS();

  return {
    editAppTypeAsyncState: editAppTypeState.editAppTypeAsyncState
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    onEditAppType: editAppTypeRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAppType);
