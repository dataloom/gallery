import React, { PropTypes } from 'react';
import Select from 'react-select';

import {
  Button
} from 'react-bootstrap';

import DeleteButton from '../../../components/buttons/DeleteButton';
import styles from './styles.module.css';

export default class SelectIncludedFields extends React.Component {
  static propTypes = {
    availablePropertyTypes: PropTypes.object.isRequired,
    selectPropertiesFn: PropTypes.func.isRequired
  }

  constructor(props) {
    const selectedPropertyTypes = Object.keys(props.availablePropertyTypes).filter((id) => {
      return (!props.availablePropertyTypes[id].piiField);
    });

    super(props);
    this.state = {
      availablePropertyTypes: props.availablePropertyTypes,
      selectedPropertyTypes,
      addPropValue: '',
      deidentify: true
    };
  }

  componentWillReceiveProps(newProps) {
    let selectedPropertyTypes = Object.keys(newProps.availablePropertyTypes);
    if (this.state.deidentify) {
      selectedPropertyTypes = selectedPropertyTypes.filter((id) => {
        return (!newProps.availablePropertyTypes[id].piiField);
      });
    }
    this.setState({
      availablePropertyTypes: newProps.availablePropertyTypes,
      selectedPropertyTypes,
      addPropValue: ''
    });
  }

  deselectProp = (propertyTypeId) => {
    const selectedPropertyTypes = this.state.selectedPropertyTypes.filter((id) => {
      return (id !== propertyTypeId);
    });
    this.setState({ selectedPropertyTypes });
  }

  addPropertyType = (e) => {
    const selectedPropertyTypes = this.state.selectedPropertyTypes;
    if (e && e.value && !selectedPropertyTypes.includes(e.value)) {
      selectedPropertyTypes.push(e.value);
      this.setState({
        selectedPropertyTypes,
        addPropValue: ''
      });
    }
  }

  getAvailablePropertyIds = () => {
    const availablePropertyTypes = this.state.availablePropertyTypes;
    const x = (!this.state.deidentify) ? Object.keys(availablePropertyTypes) :
      Object.keys(availablePropertyTypes).filter((propertyTypeId) => {
        return (!availablePropertyTypes[propertyTypeId].piiField);
      });
    return x;
  }

  renderAddPropertyType = () => {
    const { availablePropertyTypes, selectedPropertyTypes } = this.state;
    const availablePropertyIds = this.getAvailablePropertyIds();
    if (availablePropertyIds.length === selectedPropertyTypes.length) return null;
    const deselectedProps = availablePropertyIds.filter((id) => {
      return (!selectedPropertyTypes.includes(id));
    });
    const addPropOptions = deselectedProps.map((id) => {
      return { value: id, label: availablePropertyTypes[id].title };
    });

    return (
      <tr>
        <td />
        <td className={styles.tableCell}>
          <Select
              options={addPropOptions}
              value={this.state.addPropValue}
              onChange={this.addPropertyType} />
        </td>
        <td />
      </tr>
    );
  }

  link = () => {
    this.props.selectPropertiesFn(this.state.selectedPropertyTypes);
  }

  handleDeidentifyChange = (e) => {
    const selectedPropertyTypes = (!e.target.checked) ? this.state.selectedPropertyTypes :
      this.state.selectedPropertyTypes.filter((propertyTypeId) => {
        return (!this.state.availablePropertyTypes[propertyTypeId].piiField);
      });

    this.setState({
      deidentify: e.target.checked,
      selectedPropertyTypes
    });
  }

  renderDeidentify = () => {
    return (
      <div className={styles.inputRowCheckbox}>
        <label className={styles.inputLabel} htmlFor="deidentify">Deidentify: </label>
        <input
            id="deidentify"
            type="checkbox"
            defaultChecked={this.state.deidentify}
            onChange={this.handleDeidentifyChange} />
      </div>
    );
  }

  render() {
    const propertyTypes = this.state.selectedPropertyTypes.map((propertyTypeId) => {
      return (
        <tr key={propertyTypeId}>
          <td>
            <DeleteButton
                onClick={() => {
                  this.deselectProp(propertyTypeId);
                }} /></td>
          <td className={styles.tableCell}>{this.state.availablePropertyTypes[propertyTypeId].title}</td>
        </tr>
      );
    });
    return (
      <div className={styles.linkedDefinitionContainer}>
        <div className={styles.explanationText}>
          Step 3. Choose which fields to include in your linked dataset.
        </div>
        <div className={styles.entityTypeTableWrapper}>
          {this.renderDeidentify()}
          <table>
            <tbody>
              <tr>
                <th />
                <th className={styles.tableCell}>Property Type</th>
              </tr>
              {propertyTypes}
              {this.renderAddPropertyType()}
            </tbody>
          </table>
          <Button
              bsStyle="primary"
              onClick={this.link}
              className={styles.linkButton}>Confirm fields</Button>
        </div>
      </div>
    );
  }
}
