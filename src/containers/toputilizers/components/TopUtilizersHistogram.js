import React from 'react';
import PropTypes from 'prop-types';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { AnalysisApi } from 'loom-data';
import { HistogramVisualization } from '../../visualizations/HistogramVisualization';
import styles from '../styles.module.css';

const DEFAULT_SELECTED_ENTITY_TYPE = {
  title: 'Select an entity type',
  id: '',
  properties: []
};

const DEFAULT_SELECTED_PROPERTY_TYPE = {
  title: 'Select a property type',
  fqn: ''
};

export default class TopUtilizersHistogram extends React.Component {
  static propTypes = {
    results: PropTypes.object.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    entitySetId: PropTypes.string.isRequired,
    entityType: PropTypes.object.isRequired,
    neighborEntityTypes: PropTypes.array.isRequired,
    neighborPropertyTypes: PropTypes.object.isRequired,
    topUtilizersDetails: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedEntityType: DEFAULT_SELECTED_ENTITY_TYPE,
      selectedPropertyType: DEFAULT_SELECTED_PROPERTY_TYPE,
      selectedDrillDownEntityType: DEFAULT_SELECTED_ENTITY_TYPE,
      selectedDrillDownPropertyType: DEFAULT_SELECTED_PROPERTY_TYPE,
      resultValueCounts: [],
      resultFieldNames: [],
      drillDown: false
    };
  }

  formatValue = (rawValue) => {
    if (rawValue instanceof Array) {
      let formattedValue = '';
      if (rawValue.length > 0) formattedValue = formattedValue.concat(rawValue[0]);
      if (rawValue.length > 1) {
        for (let i = 1; i < rawValue.length; i += 1) {
          formattedValue = formattedValue.concat(', ').concat(rawValue[i]);
        }
      }
      return formattedValue;
    }
    return rawValue;
  }

  renderPropertyTypeSelection = (isDrillDown) => {
    const selectedEntityType = (isDrillDown) ? this.state.selectedDrillDownEntityType : this.state.selectedEntityType;
    if (!selectedEntityType) return null;
    const propertyTypes = (selectedEntityType.id === this.props.entityType.id)
      ? this.props.propertyTypes : selectedEntityType.properties.map((propertyTypeId) => {
        return this.props.neighborPropertyTypes[propertyTypeId];
      });
    const menuItems = [];
    propertyTypes.forEach((propertyType) => {
      if (isDrillDown && this.state.selectedEntityType.id === this.state.selectedDrillDownEntityType.id
        && propertyType.id === this.state.selectedPropertyType.id) return;
      const key = (isDrillDown) ? `drilldown-${propertyType.id}` : propertyType.id;
      const selectedPropertyType = (isDrillDown) ? this.state.selectedPropertyType : propertyType;
      let selectedDrillDownEntityType = this.state.selectedDrillDownEntityType;
      let selectedDrillDownPropertyType = (isDrillDown) ? propertyType : this.state.selectedDrillDownPropertyType;
      if (!isDrillDown && this.state.selectedEntityType.id === this.state.selectedDrillDownEntityType.id
        && propertyType.id === this.state.selectedDrillDownPropertyType.id) {
        selectedDrillDownEntityType = DEFAULT_SELECTED_ENTITY_TYPE;
        selectedDrillDownPropertyType = DEFAULT_SELECTED_PROPERTY_TYPE;
      }
      menuItems.push(
        <MenuItem
            onClick={() => {
              this.setState({ selectedPropertyType, selectedDrillDownPropertyType, selectedDrillDownEntityType });
            }}
            key={key}
            eventKey={key}>
          {propertyType.title}
        </MenuItem>
      );
    });
    return menuItems;
  }

  renderDropdownSelection = (isDrillDown) => {
    const selectedEntityType = (isDrillDown) ? this.state.selectedDrillDownEntityType : this.state.selectedEntityType;
    const selectedPropertyType = (isDrillDown) ? this.state.selectedDrillDownPropertyType
      : this.state.selectedPropertyType;
    const entityTypeOptions = [this.props.entityType].concat(this.props.neighborEntityTypes).map((entityType) => {
      const key = (isDrillDown) ? `drilldown-${entityType.id}` : entityType.id;
      return (
        <MenuItem
            onClick={() => {
              if (entityType.id !== selectedEntityType.id) {
                const selectedEntityTypeValue = (isDrillDown) ? this.state.selectedEntityType : entityType;
                const selectedDrillDownEntityTypeValue = (isDrillDown) ? entityType : DEFAULT_SELECTED_ENTITY_TYPE;
                const selectedPropertyTypeValue = (isDrillDown)
                  ? this.state.selectedPropertyType : DEFAULT_SELECTED_PROPERTY_TYPE;

                this.setState({
                  selectedEntityType: selectedEntityTypeValue,
                  selectedDrillDownEntityType: selectedDrillDownEntityTypeValue,
                  selectedPropertyType: selectedPropertyTypeValue,
                  selectedDrillDownPropertyType: DEFAULT_SELECTED_PROPERTY_TYPE
                });
              }
            }}
            key={key}
            eventKey={key}>
          {entityType.title}
        </MenuItem>
      );
    });

    return (
      <div className={styles.generateHistogramButtonRow}>
        <DropdownButton bsStyle="default" title={selectedEntityType.title} id="entity-type-select">
          {entityTypeOptions}
        </DropdownButton>
        <DropdownButton
            bsStyle="default"
            title={selectedPropertyType.title}
            id="property-select"
            disabled={!selectedEntityType.id}>
          {this.renderPropertyTypeSelection(isDrillDown)}
        </DropdownButton>
      </div>
    );
  }

  renderDrillDownButton = () => {
    const disabled = (!this.state.selectedEntityType.id || !this.state.selectedPropertyType.id);
    const buttonText = (this.state.drillDown) ? 'Hide drill down' : 'Drill down';
    return (
      <div className={styles.generateHistogramButtonRow}>
        <Button
            bsStyle="success"
            bsSize="small"
            disabled={disabled}
            onClick={() => {
              this.setState({ drillDown: !this.state.drillDown });
            }}>{buttonText}</Button>
      </div>
    );
  }

  renderDrillDownSelection = () => {
    if (!this.state.drillDown || !this.state.selectedEntityType.id || !this.state.selectedPropertyType.id) return null;
    return this.renderDropdownSelection(true);
  }

  renderGenerateHistogramButton = () => {
    let disabled = true;
    if (this.state.selectedEntityType.id && this.state.selectedPropertyType.id) {
      if (!this.state.selectedDrillDownEntityType.id || this.state.selectedDrillDownPropertyType.id) disabled = false;
    }
    const options = {
      details: Object.values(this.props.topUtilizersDetails),
      entityTypeId: this.state.selectedEntityType.id,
      propertyTypeId: this.state.selectedPropertyType.id
    };
    if (this.state.drillDown && this.state.selectedDrillDownEntityType.id
      && this.state.selectedDrillDownPropertyType.id) {
      options.drillDownEntityTypeId = this.state.selectedDrillDownEntityType.id;
      options.drillDownPropertyTypeId = this.state.selectedDrillDownPropertyType.id;
    }
    return (
      <div className={styles.generateHistogramButtonRow}>
        <Button
            bsStyle="primary"
            disabled={disabled}
            onClick={() => {
              AnalysisApi.getTopUtilizersHistogram(this.props.entitySetId, 100, options)
              .then((result) => {
                this.setState({
                  resultValueCounts: result.counts,
                  resultFieldNames: result.fields
                });
              });
            }}>Generate Histogram</Button>
      </div>
    );
  }

  renderHistogram = () => {
    let content;
    if (this.state.resultValueCounts.length && this.state.resultFieldNames.length) {
      content = <HistogramVisualization counts={this.state.resultValueCounts} fields={this.state.resultFieldNames} />;
    }
    return <div className={styles.histogramContainer}>{content}</div>;
  }

  render() {
    if (this.props.propertyTypes.length === 0) return null;
    return (
      <div className={styles.histogramSection}>
        {this.renderDropdownSelection(false)}
        {this.renderDrillDownSelection()}
        {this.renderDrillDownButton()}
        {this.renderGenerateHistogramButton()}
        {this.renderHistogram()}
      </div>
    );
  }
}
