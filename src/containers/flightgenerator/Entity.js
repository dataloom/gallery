import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Button } from 'react-bootstrap';

import InlineEditableControl from '../../components/controls/InlineEditableControl';
import styles from './styles.module.css';

export default class Entity extends React.Component {
  static propTypes = {
    entity: PropTypes.shape({
      entitySetId: PropTypes.string.isRequired,
      alias: PropTypes.string.isRequired,
      properties: PropTypes.object.isRequired
    }).isRequired,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    allEntitySetsAsMap: PropTypes.object.isRequired,
    allEntityTypesAsMap: PropTypes.object.isRequired,
    allPropertyTypesAsMap: PropTypes.object.isRequired
  }
  
  removeEntity = () => {
    this.props.onDelete(this.props.index);
  }

  handleEntitySetChange = (event) => {
    const { index, allEntityTypesAsMap, allEntitySetsAsMap, onChange } = this.props;
    const entitySetId = event.value;
    const properties = {};
    allEntityTypesAsMap[allEntitySetsAsMap[entitySetId].entityTypeId].properties.forEach((id) => {
      properties[id] = '';
    });
    const entity = {
      entitySetId,
      alias: allEntitySetsAsMap[entitySetId].title.concat(' Entity'),
      properties
    };
    onChange(entity, index);
  }

  handleAliasChange = (alias) => {
    const { entity, index, onChange } = this.props;
    const newEntity = Object.assign({}, entity, { alias });
    onChange(newEntity, index);
  }

  handlePropertyChange = (event, propertyTypeId) => {
    const { entity, index, onChange } = this.props;
    const newValue = event.target.value;
    const properties = Object.assign({}, entity.properties, { [propertyTypeId]: newValue });
    const newEntity = Object.assign({}, entity, { properties });
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
            onChange={this.handleAliasChange} />
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
        {this.renderProperties()}
      </div>
    );
  }
}
