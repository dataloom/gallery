/* @flow */
import React, { PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import classnames from 'classnames';

import { EntitySetSummary, EntitySetPropType } from './EntitySet';
import styles from '../../containers/catalog/catalog.module.css';

const baseEntitySetListPropTypes = {
  entitySets: PropTypes.arrayOf(EntitySetPropType).isRequired,
  className: PropTypes.string
};

export class EntitySetList extends React.Component {
  static propTypes = baseEntitySetListPropTypes;

  render() {
    const entitySetList = this.props.entitySets.map((entitySet) => {
      return (
        <EntitySetSummary
          key={entitySet.key}
          entitySet={entitySet}
        />
      );
    });

    return (
      <div className={classnames(styles.entitySetList, this.props.className)}>
        {entitySetList}
      </div>
    );
  }
}

export const FilterParamsPropType = PropTypes.shape({
  keyword: PropTypes.string,
  propertyTypeIds: PropTypes.arrayOf(React.PropTypes.string),
  entityTypeId: PropTypes.string
});

export const filteredEntitySetListPropTypes = Object.assign({}, baseEntitySetListPropTypes, {
  filterParams: FilterParamsPropType.isRequired,
  onFilterUpdate: PropTypes.func
});

export class FilteredEntitySetList extends React.Component {
  static propTypes = filteredEntitySetListPropTypes;

  constructor(props) {
    super(props);

    this.onKeywordChange = this.onKeywordChange.bind(this);
    this.onPropertyTypesChange = this.onPropertyTypesChange.bind(this);
    this.onEntityTypeChange = this.onEntityTypeChange.bind(this);
  }

  onKeywordChange(event) {
    const { onFilterUpdate } = this.props;

    if (onFilterUpdate) {
      let params = Object.assign({}, this.props.filterParams, {
        keyword: event.target.value
      });
      onFilterUpdate(params);
    }
  }

  // TODO: Upgrade PropertyTypes and EntitityType with selects
  onPropertyTypesChange(event) {
    const { onFilterUpdate } = this.props;

    if (onFilterUpdate) {
      let params = Object.assign({}, this.props.filterParams, {
        propertyTypeIds: [event.target.value]
      });
      onFilterUpdate(params);
    }
  }

  onEntityTypeChange(event) {
    const { onFilterUpdate } = this.props;

    if (onFilterUpdate) {
      let params = Object.assign({}, this.props.filterParams, {
        entityTypeId: event.target.value
      });
      onFilterUpdate(params);
    }
  }

  render() {
    const { filterParams } = this.props;
    return (
      <div className={classnames(styles.filteredEntitySetList, this.props.className)}>
        <header>
          <div className={styles.centeredContent}>
            <h1>Browse the calatog</h1>
            <form className={styles.searchForm}>
              <FormGroup>
                <ControlLabel>Keyword</ControlLabel>
                <FormControl type="text" onChange={this.onKeywordChange} />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Property types</ControlLabel>
                <FormControl type="text" onChange={this.onPropertyTypesChange} />
              </FormGroup>
              <span className={styles.searchOr}>Or</span>
              <FormGroup>
                <ControlLabel>Entity type</ControlLabel>
                <FormControl type="text" onChange={this.onEntityTypeChange}/>
              </FormGroup>
            </form>
          </div>
        </header>

        <EntitySetList className={styles.centeredContent} {...this.props}/>
      </div>
    );
  }
}