import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import InlineEditableControl from '../../../../components/controls/InlineEditableControl';
import { PropertyTypePropType } from '../../../../containers/edm/EdmModel';
import styles from '../styles.module.css';

export class PropertyType extends React.Component {
  static propTypes = {
    propertyType: PropertyTypePropType.isRequired
  };

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  renderPii = (prop) => {
    return (prop.piiField) ? ' (PII)' : '';
  }

  updatePropertyTypeTitle = (title) => {
    EntityDataModelApi.updatePropertyTypeMetaData(this.props.propertyType.id, { title });
  }

  updatePropertyTypeDescription = (description) => {
    EntityDataModelApi.updatePropertyTypeMetaData(this.props.propertyType.id, { description });
  }

  render() {
    const prop = this.props.propertyType;
    return (
      <div>
        <div className={styles.italic}>{`${prop.type.namespace}.${prop.type.name}${this.renderPii(prop)}`}</div>
        <div className={styles.spacerSmall} />
        <InlineEditableControl
            type="text"
            size="xlarge"
            placeholder="Property type title..."
            value={prop.title}
            viewOnly={!this.context.isAdmin}
            onChange={this.updatePropertyTypeTitle} />
        <InlineEditableControl
            type="textarea"
            size="small"
            placeholder="Property type description..."
            value={prop.description}
            viewOnly={!this.context.isAdmin}
            onChange={this.updatePropertyTypeDescription} />
        <div className={styles.spacerSmall} />
        <div className={styles.italic}>datatype: {prop.datatype}</div>
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default PropertyType;
