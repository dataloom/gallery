import React from 'react';
import PropTypes from 'prop-types';
import { SplitButton, MenuItem } from 'react-bootstrap';
import { HistogramVisualization } from '../../visualizations/HistogramVisualization';
import styles from '../styles.module.css';

const FIELDS_TO_IGNORE = ['count', 'id'];

export default class TopUtilizersHistogramContainer extends React.Component {
  static propTypes = {
    results: PropTypes.object.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    entitySetId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      formattedData: this.formatResultData(props.results),
      selectedProperty: {
        title: 'Select a property type',
        fqn: ''
      }
    };
  }

  formatResultData = (results) => {
    const formattedData = {};
    results.forEach((row) => {
      Object.keys(row).forEach((fieldName) => {
        if (FIELDS_TO_IGNORE.includes(fieldName)) return;
        const valueMap = formattedData[fieldName] || {};
        const rowValues = row[fieldName];
        rowValues.forEach((value) => {
          if (valueMap[value]) {
            valueMap[value] += 1;
          }
          else {
            valueMap[value] = 1;
          }
        });
        formattedData[fieldName] = valueMap;
      });
    });
    return formattedData;
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

  renderPropertySelection = () => {
    const menuItems = this.props.propertyTypes.map((propertyType) => {
      return (
        <MenuItem
            onClick={() => {
              this.setState({ selectedProperty: propertyType });
            }}
            key={propertyType.id}
            eventKey={propertyType.id}>
          {propertyType.title}
        </MenuItem>
      );
    });
    const title = this.state.selectedProperty.title || 'Select a property';
    return (
      <div>
        <SplitButton bsStyle="default" title={title} id="property-select">
          {menuItems}
        </SplitButton>
      </div>
    );
  }

  renderHistogram = () => {
    let content;
    if (this.state.selectedProperty.type) {
      const fqn = `${this.state.selectedProperty.type.namespace}.${this.state.selectedProperty.type.name}`;
      if (fqn && fqn.length) {
        const propertyData = this.state.formattedData[fqn];
        if (propertyData) {
          content = <HistogramVisualization data={propertyData} propertyType={this.state.selectedProperty} />;
        }
      }
    }
    return <div className={styles.histogramContainer}>{content}</div>;
  }

  render() {
    if (this.props.propertyTypes.length === 0) return null;
    return (
      <div className={styles.histogramSection}>
        {this.renderPropertySelection()}
        {this.renderHistogram()}
      </div>
    );
  }
}
