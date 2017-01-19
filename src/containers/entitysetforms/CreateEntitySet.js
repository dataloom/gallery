import React, { PropTypes } from 'react';
import { FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Select from 'react-select';
import classnames from 'classnames';
import { connect } from 'react-redux';

import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import * as edmActionFactories from '../edm/EdmActionFactories';
import { getEdmObjectsShallow } from '../edm/EdmStorage';
import { EntityTypePropType } from '../../components/entityset/EntitySetStorage';

class CreateEntitySet extends React.Component {
  static propTypes = {
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

  onDescriptionChange = (event) => {
    this.setState({
      description: event.target.value
    });
  };

  onEntityTypeChange = (option) => {
    this.setState({
      entitySetTypeId: option.value
    });
  };

  onSubmit = () => {
    const { title, description, entitySetTypeId} = this.state;
    const createParams = {};

    if (title) {
      createParams.title = title;
    }
    if (description) {
      createParams.description = description;
    }
    if (entitySetTypeId) {
      createParams.entitySetTypeId = entitySetTypeId.value;
    }
    this.props.onCreate(createParams);
  };

  getEntityTypeOptions() {
    return this.props.entityTypes.map(entityType => {
      return {
        value: entityType.id,
        label: entityType.title
      };
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className={classnames(this.props.className)}>
        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <FormControl type="text" onChange={this.onTitleChange}/>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl componentClass="textarea" onChange={this.onDescriptionChange}/>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Entity type</ControlLabel>
          <Select
            value={this.state.entitySetTypeId}
            options={this.getEntityTypeOptions()}
            onChange={this.onEntityTypeChange}
          />
        </FormGroup>
        <Button type="submit" bsStyle="primary">Create</Button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  const normalizedData = state.get('normalizedData').toJS(),
    entityTypeReferences = state.get('createEntitySet').get('entityTypeReferences').toJS();
  return {
    entityTypes: getEdmObjectsShallow(normalizedData, entityTypeReferences)
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    onCreate: () => {},
    loadEntityTypes: () => { dispatch(edmActionFactories.allEntityTypesRequest())}
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEntitySet);