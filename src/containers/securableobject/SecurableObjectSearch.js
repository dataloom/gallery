import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Select from 'react-select';
import { FormGroup, InputGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';

import { EntityTypePropType } from '../../components/entityset/EntitySetStorage';
import { PropertyTypePropType } from '../../components/propertytype/PropertyTypeStorage';
import { getEdmObjectsShallow } from '../edm/EdmStorage';
import * as edmActionFactories from '../edm/EdmActionFactories';
import styles from './securableobject.module.css';


export const FilterParamsPropType = PropTypes.shape({
  keyword: PropTypes.string,
  propertyTypeIds: PropTypes.arrayOf(React.PropTypes.string),
  entitySetTypeId: PropTypes.string
});

class SecurableObjectSearch extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    entityTypes: PropTypes.arrayOf(EntityTypePropType).isRequired,
    loadEntityTypes: PropTypes.func.isRequired,
    propertyTypes: PropTypes.arrayOf(PropertyTypePropType).isRequired,
    loadPropertyTypes: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    filterParams: FilterParamsPropType
  };

  constructor(props) {
    super(props);

    this.state = Object.assign({
      keyword: '',
      propertyTypeIds: [],
      entitySetTypeId: ''
    }, this.props.filterParams);
  }

  componentDidMount() {
    this.props.loadEntityTypes();
    this.props.loadPropertyTypes();
  }

  onKeywordChange = (event) => {
    this.setState({
      keyword: event.target.value
    });
  };

  onPropertyTypesChange = (options) => {
    this.setState({
      propertyTypeIds: options.map(option => option.value)
    });
  };

  onEntityTypeChange = (option) => {
    this.setState({
      entitySetTypeId: option.value
    });
  };

  onSubmit = () => {
    const { keyword, propertyTypeIds, entitySetTypeId} = this.state;
    const filterParams = {};

    if (keyword) {
      filterParams.keyword = keyword;
    }
    if (propertyTypeIds && propertyTypeIds.length > 0) {
      filterParams.propertyTypeIds = propertyTypeIds;
    }
    if (entitySetTypeId) {
      filterParams.entitySetTypeId = entitySetTypeId.value;
    }
    this.props.onSubmit(filterParams);
  };

  getEntityTypeOptions() {
    return this.props.entityTypes.map(entityType => {
      return {
        value: entityType.id,
        label: entityType.title
      };
    });
  }

  getPropertyTypeOptions() {
    return this.props.propertyTypes.map(propertyType => {
      return {
        value: propertyType.id,
        label: propertyType.title
      };
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className={classnames(this.props.className, styles.search)}>
        <FormGroup className={styles.keyword}>
          <ControlLabel>Keyword</ControlLabel>
          <InputGroup>
            <InputGroup.Addon><FontAwesome name="search"/></InputGroup.Addon>
            <FormControl
              value={this.state.keyword}
              type="text"
              onChange={this.onKeywordChange}
            />
          </InputGroup>
        </FormGroup>

        <FormGroup className={styles.propertyTypes}>
          <ControlLabel>Property types</ControlLabel>
          <Select
            value={this.state.propertyTypeIds}
            options={this.getPropertyTypeOptions()}
            onChange={this.onPropertyTypesChange}
            multi={true}
          />
        </FormGroup>

        <span className={styles.divider}>Or</span>

        <FormGroup className={styles.entityType}>
          <ControlLabel>Entity type</ControlLabel>
          <Select
            value={this.state.entitySetTypeId}
            options={this.getEntityTypeOptions()}
            onChange={this.onEntityTypeChange}
          />
        </FormGroup>

        <Button type="submit" bsStyle="primary" className={styles.submitButton}>Search</Button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  const normalizedData = state.get('normalizedData').toJS(),
    securableObject = state.get('securableObject').toJS();
  return {
    entityTypes: getEdmObjectsShallow(normalizedData, securableObject.entityTypeReferences),
    propertyTypes: getEdmObjectsShallow(normalizedData, securableObject.propertyTypeReferences),
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    loadPropertyTypes: () => { dispatch(edmActionFactories.allPropertyTypesRequest()); },
    loadEntityTypes: () => { dispatch(edmActionFactories.allEntityTypesRequest()); }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SecurableObjectSearch);