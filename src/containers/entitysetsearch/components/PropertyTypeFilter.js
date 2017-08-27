import React, { PropTypes } from 'react';
import { Collapse } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import styles from '../styles.module.css';

export default class PropertyTypeFilter extends React.Component {
  static propTypes = {
    propertyTypes: PropTypes.array.isRequired,
    onListUpdate: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      selectedProperties: this.getAllPropertyTypeIds(this.props.propertyTypes)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.propertyTypes.length !== nextProps.propertyTypes.length) {
      this.setState({ selectedProperties: this.getAllPropertyTypeIds(nextProps.propertyTypes) });
    }
  }

  getAllPropertyTypeIds = (propertyTypes) => {
    const propertyTypeIds = new Set();
    propertyTypes.forEach((propertyType) => {
      propertyTypeIds.add(propertyType.id);
    });
    return propertyTypeIds;
  }

  updateChecked = (e, propertyTypeId) => {
    const selectedProperties = this.state.selectedProperties;
    if (e.target.checked) {
      selectedProperties.add(propertyTypeId);
    }
    else {
      selectedProperties.delete(propertyTypeId);
    }
    this.setState({ selectedProperties });
    const filteredPropertyTypes = this.props.propertyTypes.filter((propertyType) => {
      return selectedProperties.has(propertyType.id);
    });
    this.props.onListUpdate(filteredPropertyTypes);
  }

  renderCheckbox = (propertyType) => {
    return (
      <div key={propertyType.id}>
        <input
            type="checkbox"
            name={propertyType.id}
            checked={this.state.selectedProperties.has(propertyType.id)}
            onChange={(e) => {
              this.updateChecked(e, propertyType.id);
            }} />
        <label htmlFor={propertyType.id} className={styles.checkboxLabel}>{propertyType.title}</label>
      </div>
    );
  }

  renderFilterBody = () => {
    const checkboxes = this.props.propertyTypes.map((propertyType) => {
      return this.renderCheckbox(propertyType);
    });

    return (
      <Collapse in={this.state.show}>
        <div className={styles.checkboxContainer}>
          <div className={styles.checkboxTitle}>Select properties to display.</div>
          {checkboxes}
        </div>
      </Collapse>
    );
  }

  render() {
    const buttonName = (this.state.show) ? 'angle-up' : 'angle-down';
    return (
      <div>
        <div className={styles.displayPreferencesTitleBar}>
          <div>Filter Properties</div>
        </div>
        {this.renderFilterBody()}
        <button
            className={styles.expandDisplayPreferencesButton}
            onClick={() => {
              this.setState({ show: !this.state.show });
            }}>
          <FontAwesome name={buttonName} size="2x" />
        </button>
      </div>
    );
  }

}
