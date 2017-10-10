import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Button } from 'react-bootstrap';

import InlineEditableControl from '../../components/controls/InlineEditableControl';
import styles from './styles.module.css';

const timeZonesMap = {
  'UTC (Universal Coordinated Time)': '0',
  'EST (New York)': '-5',
  'CST (Chicago)': '-6',
  'MST (Denver)': '-7',
  'PST (Los Angeles)': '-8'
};

export default class Entity extends React.Component {
  static propTypes = {
    entity: PropTypes.shape({
      entitySetId: PropTypes.string.isRequired,
      alias: PropTypes.string.isRequired,
      useCurrentSync: PropTypes.bool.isRequired,
      properties: PropTypes.object.isRequired,
      dateFormats: PropTypes.object,
      timeZones: PropTypes.object
    }).isRequired,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    allEntitySetsAsMap: PropTypes.object.isRequired,
    allEntityTypesAsMap: PropTypes.object.isRequired,
    allPropertyTypesAsMap: PropTypes.object.isRequired,
    usedAliases: PropTypes.array.isRequired
  }

  removeEntity = () => {
    this.props.onDelete(this.props.index);
  }

  handleEntitySetChange = (event) => {
    const { index, allEntityTypesAsMap, allPropertyTypesAsMap, allEntitySetsAsMap, onChange, usedAliases } = this.props;
    const entitySetId = event.value;
    const properties = {};
    const dateFormats = {};
    const timeZones = {};
    allEntityTypesAsMap[allEntitySetsAsMap[entitySetId].entityTypeId].properties.forEach((id) => {
      properties[id] = '';
      if (allPropertyTypesAsMap[id].datatype === 'Date') {
        dateFormats[id] = '';
        timeZones[id] = '0';
      }
    });
    const baseAlias = allEntitySetsAsMap[entitySetId].title.concat(' Entity');
    let alias = baseAlias;
    let counter = 1;
    while (usedAliases.includes(alias)) {
      alias = baseAlias.concat(` (${counter})`);
      counter += 1;
    }
    const entity = Object.assign({}, this.props.entity, { entitySetId, alias, properties, dateFormats, timeZones });
    onChange(entity, index);
  }

  handleAliasChange = (alias) => {
    const { entity, index, onChange, usedAliases } = this.props;
    if (usedAliases.includes(alias)) return Promise.resolve(false);
    const newEntity = Object.assign({}, entity, { alias });
    onChange(newEntity, index);
    return Promise.resolve(true);
  }

  handleCurrentSyncChange = () => {
    const { entity, index, onChange } = this.props;
    const newEntity = Object.assign({}, entity, { useCurrentSync: !entity.useCurrentSync });
    onChange(newEntity, index);
  }

  handlePropertyChange = (event, propertyTypeId) => {
    const { entity, index, onChange } = this.props;
    const newValue = event.target.value;
    const properties = Object.assign({}, entity.properties, { [propertyTypeId]: newValue });
    const newEntity = Object.assign({}, entity, { properties });
    onChange(newEntity, index);
  }

  handleDateFormatChange = (newFormat, propertyTypeId) => {
    const { entity, index, onChange } = this.props;
    const format = { [propertyTypeId]: newFormat };
    const dateFormats = (entity.dateFormats) ? Object.assign({}, entity.dateFormats, format) : format;
    const newEntity = Object.assign({}, entity, { dateFormats });
    onChange(newEntity, index);
  }

  handleTimeZoneChange = (newTimeZone, propertyTypeId) => {
    const { entity, index, onChange } = this.props;
    const timeZone = { [propertyTypeId]: newTimeZone };
    const timeZones = (entity.timeZones) ? Object.assign({}, entity.timeZones, timeZone) : timeZone;
    const newEntity = Object.assign({}, entity, { timeZones });
    onChange(newEntity, index);
  }

  renderDeleteButton = () => {
    return (
      <div className={styles.deleteButton}>
        <Button
            bsStyle="danger"
            onClick={this.removeEntity}>
          Remove
        </Button>
      </div>
    );
  }

  renderEntitySetSelection = () => {
    const options = [];
    Object.values(this.props.allEntitySetsAsMap).forEach((entitySet) => {
      if (this.props.allEntityTypesAsMap[entitySet.entityTypeId]) {
        options.push({ label: entitySet.title, value: entitySet.id });
      }
    });
    return (
      <Select
          value={this.props.entity.entitySetId}
          onChange={this.handleEntitySetChange}
          options={options} />
    );
  }

  renderAlias = () => {
    const alias = this.props.entity.alias;
    if (!alias.length) return null;
    return (
      <div className={styles.alias}>
        <InlineEditableControl
            type="text"
            size="medium"
            placeholder="Entity alias"
            value={alias}
            onChangeConfirm={this.handleAliasChange} />
      </div>
    );
  }

  renderCurrentSync = () => {
    if (!this.props.entity.alias.length) return null;
    const useCurrentSync = this.props.entity.useCurrentSync;
    const name = `${this.props.entity.alias}-sync`;
    return (
      <div className={styles.currentSync}>
        <input
            name={name}
            type="checkbox"
            checked={!useCurrentSync}
            onChange={this.handleCurrentSyncChange} />
        <label className={styles.currentSyncLabel} htmlFor={name}>Overwrite existing data for entity set?</label>
      </div>
    );
  }

  renderDateFormatInput = (property) => {
    if (property.datatype !== 'Date') return null;
    let formatValue = '';
    let timeZoneValue = '';
    if (this.props.entity.dateFormats && this.props.entity.dateFormats[property.id]) {
      formatValue = this.props.entity.dateFormats[property.id];
    }
    if (this.props.entity.timeZones && this.props.entity.timeZones[property.id]) {
      timeZoneValue = this.props.entity.timeZones[property.id];
    }
    const timeZoneOptions = Object.keys(timeZonesMap).map((timeZone) => {
      const offset = timeZonesMap[timeZone];
      return { label: timeZone, value: offset };
    });
    return (
      <div>
        <td className={styles.tableCell}>
          <input
              type="text"
              placeholder="Date format"
              value={formatValue}
              onChange={(event) => {
                this.handleDateFormatChange(event.target.value, property.id);
              }} />
        </td>
        <td className={styles.tableCell} style={{ width: '500px' }}>
          <Select
              value={timeZoneValue}
              options={timeZoneOptions}
              clearable={false}
              backspaceRemoves={false}
              deleteRemoves={false}
              onChange={(event) => {
                this.handleTimeZoneChange(event.value, property.id);
              }} />
        </td>
      </div>
    );
  }

  renderProperties = () => {
    const properties = Object.keys(this.props.entity.properties).map((propertyTypeId) => {
      const property = this.props.allPropertyTypesAsMap[propertyTypeId];
      const title = property.title;
      const fqn = `${property.type.namespace}.${property.type.name}`;
      return (
        <tr key={propertyTypeId} className={styles.propertyName}>
          <td className={styles.tableCell}>
            <span className={styles.propertyName}>{title} <i>({fqn})</i></span>
          </td>
          <td className={styles.tableCell}>
            <input
                type="text"
                placeholder="CSV Header Name"
                value={this.props.entity.properties[propertyTypeId]}
                onChange={(e) => {
                  this.handlePropertyChange(e, propertyTypeId);
                }} />
          </td>
          {this.renderDateFormatInput(property)}
        </tr>
      );
    });
    return (
      <table>
        <tbody>
          {properties}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div>
        {this.renderDeleteButton()}
        {this.renderEntitySetSelection()}
        {this.renderAlias()}
        {this.renderCurrentSync()}
        {this.renderProperties()}
      </div>
    );
  }
}
