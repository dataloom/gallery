import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Button } from 'react-bootstrap';

import styles from './styles.module.css';

const timeZonesMap = {
  'UTC (Universal Coordinated Time)': '0',
  'EST (New York)': '-5',
  'CST (Chicago)': '-6',
  'MST (Denver)': '-7',
  'PST (Los Angeles)': '-8'
};


export default class Association extends React.Component {
  static propTypes = {
    association: PropTypes.shape({
      entitySetId: PropTypes.string.isRequired,
      alias: PropTypes.string.isRequired,
      useCurrentSync: PropTypes.bool.isRequired,
      properties: PropTypes.object.isRequired,
      src: PropTypes.string.isRequired,
      dst: PropTypes.string.isRequired,
      dateFormats: PropTypes.object,
      timeZones: PropTypes.object
    }).isRequired,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    allEntitySetsAsMap: PropTypes.object.isRequired,
    allEntityTypesAsMap: PropTypes.object.isRequired,
    allPropertyTypesAsMap: PropTypes.object.isRequired,
    allAssociationTypesAsMap: PropTypes.object.isRequired,
    entities: PropTypes.array.isRequired
  }

  removeAssociation = () => {
    this.props.onDelete(this.props.index);
  }

  handleEntitySetChange = (event) => {
    const { index, allAssociationTypesAsMap, allPropertyTypesAsMap, allEntitySetsAsMap, onChange } = this.props;
    const entitySetId = event.value;
    const properties = {};
    const dateFormats = {};
    const timeZones = {};
    allAssociationTypesAsMap[allEntitySetsAsMap[entitySetId].entityTypeId].entityType.properties.forEach((id) => {
      properties[id] = '';
      if (allPropertyTypesAsMap[id].datatype === 'Date') {
        dateFormats[id] = '';
        timeZones[id] = '0';
      }
    });
    const association = Object.assign({}, this.props.association, {
      entitySetId,
      alias: allEntitySetsAsMap[entitySetId].title.concat(' Entity'),
      properties,
      dateFormats,
      timeZones,
      src: '',
      dst: ''
    });
    onChange(association, index);
  }

  handleAliasChange = (alias) => {
    const { association, index, onChange } = this.props;
    const newAssociation = Object.assign({}, association, { alias });
    onChange(newAssociation, index);
  }

  handlePropertyChange = (event, propertyTypeId) => {
    const { association, index, onChange } = this.props;
    const newValue = event.target.value;
    const properties = Object.assign({}, association.properties, { [propertyTypeId]: newValue });
    const newAssociation = Object.assign({}, association, { properties });
    onChange(newAssociation, index);
  }

  handleDateFormatChange = (newFormat, propertyTypeId) => {
    const { association, index, onChange } = this.props;
    const format = { [propertyTypeId]: newFormat };
    const dateFormats = (association.dateFormats) ? Object.assign({}, association.dateFormats, format) : format;
    const newEntity = Object.assign({}, association, { dateFormats });
    onChange(newEntity, index);
  }

  handleTimeZoneChange = (newTimeZone, propertyTypeId) => {
    const { association, index, onChange } = this.props;
    const timeZone = { [propertyTypeId]: newTimeZone };
    const timeZones = (association.timeZones) ? Object.assign({}, association.timeZones, timeZone) : timeZone;
    const newAssociation = Object.assign({}, association, { timeZones });
    onChange(newAssociation, index);
  }

  handleSrcChange = (event) => {
    const { association, index, onChange } = this.props;
    const newAssociation = Object.assign({}, association, { src: event.value });
    onChange(newAssociation, index);
  }

  handleDstChange = (event) => {
    const { association, index, onChange } = this.props;
    const newAssociation = Object.assign({}, association, { dst: event.value });
    onChange(newAssociation, index);
  }

  handleCurrentSyncChange = () => {
    const { association, index, onChange } = this.props;
    const newAssociation = Object.assign({}, association, { useCurrentSync: !association.useCurrentSync });
    onChange(newAssociation, index);
  }

  renderDeleteButton = () => {
    return (
      <div className={styles.deleteButton}>
        <Button
            bsStyle="danger"
            onClick={this.removeAssociation}>
          Remove
        </Button>
      </div>
    );
  }

  renderEntitySetSelection = () => {
    const entityTypeIds = new Set();
    this.props.entities.forEach((entity) => {
      if (entity.entitySetId.length) {
        const entityTypeId = this.props.allEntitySetsAsMap[entity.entitySetId].entityTypeId;
        entityTypeIds.add(entityTypeId);
      }
    });

    const options = [];
    Object.values(this.props.allEntitySetsAsMap).forEach((entitySet) => {
      const association = this.props.allAssociationTypesAsMap[entitySet.entityTypeId];
      if (association) {
        let hasSrc = false;
        let hasDst = false;
        association.src.forEach((entityTypeId) => {
          if (entityTypeIds.has(entityTypeId)) hasSrc = true;
        });
        association.dst.forEach((entityTypeId) => {
          if (entityTypeIds.has(entityTypeId)) hasDst = true;
        });
        if (hasSrc && hasDst) {
          options.push({ label: entitySet.title, value: entitySet.id });
        }
      }
    });
    return (
      <Select
          value={this.props.association.entitySetId}
          onChange={this.handleEntitySetChange}
          options={options} />
    );
  }

  renderDateFormatInput = (property) => {
    if (property.datatype !== 'Date') return null;
    let formatValue = '';
    let timeZoneValue = '';
    if (this.props.association.dateFormats && this.props.association.dateFormats[property.id]) {
      formatValue = this.props.association.dateFormats[property.id];
    }
    if (this.props.association.timeZones && this.props.association.timeZones[property.id]) {
      timeZoneValue = this.props.association.timeZones[property.id];
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
    const properties = Object.keys(this.props.association.properties).map((propertyTypeId) => {
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
                value={this.props.association.properties[propertyTypeId]}
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

  getEntityTypeOptions = (srcOrDst) => {
    const { association, allEntitySetsAsMap, allAssociationTypesAsMap, entities } = this.props;
    const entityTypeIds = allAssociationTypesAsMap[allEntitySetsAsMap[association.entitySetId].entityTypeId][srcOrDst];
    const options = [];
    entities.forEach((entity) => {
      if (entity.entitySetId.length) {
        const entityTypeId = allEntitySetsAsMap[entity.entitySetId].entityTypeId;
        if (entityTypeIds.includes(entityTypeId)) options.push({ label: entity.alias, value: entity.alias });
      }
    });
    return options;
  }

  renderSrcSelection = () => {
    if (!this.props.association.entitySetId.length) return null;
    const options = this.getEntityTypeOptions('src');
    return (
      <div>
        <div>Source entity:</div>
        <Select
            value={this.props.association.src}
            onChange={this.handleSrcChange}
            options={options} />
      </div>
    );
  }

  renderDstSelection = () => {
    if (!this.props.association.entitySetId.length) return null;
    const options = this.getEntityTypeOptions('dst');
    return (
      <div>
        <div>Destination entity:</div>
        <Select
            value={this.props.association.dst}
            onChange={this.handleDstChange}
            options={options} />
      </div>
    );
  }

  renderCurrentSync = () => {
    if (!this.props.association.entitySetId.length) return null;
    const useCurrentSync = this.props.association.useCurrentSync;
    const name = `association${this.props.index}-sync`;
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

  render() {
    return (
      <div>
        {this.renderDeleteButton()}
        {this.renderEntitySetSelection()}
        {this.renderSrcSelection()}
        {this.renderDstSelection()}
        {this.renderCurrentSync()}
        {this.renderProperties()}
      </div>
    );
  }
}
