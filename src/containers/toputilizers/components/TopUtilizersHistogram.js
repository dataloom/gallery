import React from 'react';
import PropTypes from 'prop-types';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
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
    entityType: PropTypes.object.isRequired,
    neighborEntityTypes: PropTypes.array.isRequired,
    neighborPropertyTypes: PropTypes.object.isRequired,
    neighbors: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedEntityType: DEFAULT_SELECTED_ENTITY_TYPE,
      selectedPropertyType: DEFAULT_SELECTED_PROPERTY_TYPE,
      selectedDrillDownEntityType: DEFAULT_SELECTED_ENTITY_TYPE,
      selectedDrillDownPropertyType: DEFAULT_SELECTED_PROPERTY_TYPE,
      histogramData: {
        counts: [],
        fields: []
      },
      drillDown: false
    };
  }

  getFieldValues = (utilizer, neighbors, entityTypeId, propertyType) => {
    const values = [];
    const propertyTypeFqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
    if (entityTypeId === this.props.entityType.id && utilizer[propertyTypeFqn]) {
      utilizer[propertyTypeFqn].forEach((value) => {
        values.push(value);
      });
    }
    neighbors.forEach((neighbor) => {
      if (neighbor.neighborEntitySet && neighbor.neighborEntitySet.entityTypeId === entityTypeId
        && neighbor.neighborDetails && neighbor.neighborDetails[propertyTypeFqn]) {
        neighbor.neighborDetails[propertyTypeFqn].forEach((value) => {
          values.push(value);
        });
      }
    });
    return values;
  }

  getHistogramData = (
    selectedEntityType,
    selectedPropertyType,
    selectedDrillDownEntityType,
    selectedDrillDownPropertyType,
    drillDown) => {
    const resultList = [];
    const counts = {};
    const fields = new Set();

    const isSimple = (!drillDown || !selectedDrillDownEntityType.id || !selectedDrillDownPropertyType.id);
    if (isSimple) fields.add('count');
    this.props.results.forEach((utilizer) => {
      const entityId = utilizer.id[0];
      const primaryValues = (this.props.neighbors[entityId]) ? this.getFieldValues(
        utilizer,
        this.props.neighbors[entityId],
        selectedEntityType.id,
        selectedPropertyType) : [];
      primaryValues.forEach((primaryValue) => {
        if (!counts[primaryValue]) counts[primaryValue] = {};
        const fieldNames = (isSimple) ? ['count'] : this.getFieldValues(
          utilizer,
          this.props.neighbors[entityId],
          selectedDrillDownEntityType.id,
          selectedDrillDownPropertyType);
        fieldNames.forEach((fieldName) => {
          fields.add(fieldName);
          const newCount = (counts[primaryValue][fieldName]) ? counts[primaryValue][fieldName] + 1 : 1;
          counts[primaryValue] = Object.assign(counts[primaryValue], { [fieldName]: newCount });
        });
      });
    });
    Object.keys(counts).forEach((barName) => {
      const histogramValues = { name: barName };
      Object.keys(counts[barName]).forEach((fieldName) => {
        histogramValues[fieldName] = counts[barName][fieldName];
      });
      resultList.push(histogramValues);
    });
    return {
      counts: resultList,
      fields: Array.from(fields)
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
              this.setState({
                selectedPropertyType,
                selectedDrillDownPropertyType,
                selectedDrillDownEntityType,
                histogramData: this.getHistogramData(
                  this.state.selectedEntityType,
                  selectedPropertyType,
                  selectedDrillDownEntityType,
                  selectedDrillDownPropertyType,
                  this.state.drillDown)
              });
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
              const histogramData = (this.state.drillDown) ? this.getHistogramData(
                this.state.selectedEntityType,
                this.state.selectedPropertyType,
                {},
                {},
                !this.state.drillDown) : this.state.histogramData;
              this.setState({
                drillDown: !this.state.drillDown,
                histogramData
              });
            }}>{buttonText}</Button>
      </div>
    );
  }

  renderDrillDownSelection = () => {
    if (!this.state.drillDown || !this.state.selectedEntityType.id || !this.state.selectedPropertyType.id) return null;
    return this.renderDropdownSelection(true);
  }

  renderHistogram = () => {
    let content;
    const { counts, fields } = this.state.histogramData;
    if (counts.length && fields.length) {
      content = <HistogramVisualization counts={counts} fields={fields} />;
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
        {this.renderHistogram()}
      </div>
    );
  }
}
