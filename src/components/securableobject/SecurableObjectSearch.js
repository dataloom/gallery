import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Select from 'react-select';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

const OptionsPropType = PropTypes.shape({
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
});

export const FilterParamsPropType = PropTypes.shape({
  keyword: PropTypes.string,
  propertyTypeIds: PropTypes.arrayOf(React.PropTypes.string),
  entitySetTypeId: PropTypes.string
});


export default class SecurableObjectSearch extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    entitySetTypeOptions: PropTypes.arrayOf(OptionsPropType).isRequired,
    propertyTypeOptions: PropTypes.arrayOf(OptionsPropType).isRequired,
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

  onKeywordChange = (event) => {
    this.setState({
      keyword: event.target.value
    });
  };

  // TODO: Upgrade PropertyTypes and EntitityType with selects
  onPropertyTypesChange = (option) => {
    this.setState({
      propertyTypeIds: option
    });
  };

  onEntityTypeChange = (option) => {
    this.setState({
      entitySetTypeId: option
    });
  };

  onSubmit = () => {
    const { keyword, propertyTypeIds, entitySetTypeId} = this.state;
    const filterParams = {};

    if (keyword) {
      filterParams.keyword = keyword;
    }
    if (propertyTypeIds && propertyTypeIds.length > 0) {
      filterParams.propertyTypeIds = propertyTypeIds.map(option => option.value);
    }
    if (entitySetTypeId) {
      filterParams.entitySetTypeId = entitySetTypeId.value;
    }
    this.props.onSubmit(filterParams);
  };

  render() {
    return (
      <div className={classnames(this.props.className)}>
        <form onSubmit={this.onSubmit}>
          <FormGroup>
            <ControlLabel>Keyword</ControlLabel>
            <FormControl
              value={this.state.keyword}
              type="text"
              onChange={this.onKeywordChange}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Property types</ControlLabel>
            <Select
              value={this.state.propertyTypeIds}
              options={this.props.propertyTypeOptions}
              onChange={this.onPropertyTypesChange}
              multi={true}
            />
          </FormGroup>
          <span className="divider">Or</span>
          <FormGroup>
            <ControlLabel>Entity type</ControlLabel>
            <Select
              value={this.state.entitySetTypeId}
              options={this.props.entitySetTypeOptions}
              onChange={this.onEntityTypeChange}
            />
          </FormGroup>

          <Button type="submit" bsStyle="primary">Search</Button>
        </form>
      </div>
    );
  }
}