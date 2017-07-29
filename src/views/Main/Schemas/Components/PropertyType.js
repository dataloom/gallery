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

  renderPiiField = (prop) => {
    let value = (prop.piiField) ? 'Contains PII' : '';
    const optionalSpacer = (prop.piiField) ? <br /> : null;
    if (this.context.isAdmin) {
      value = (
        <span>
          Contains PII:&nbsp;
          <input
              type="checkbox"
              defaultChecked={prop.piiField}
              onChange={(e) => {
                this.updatePropertyTypePii(e.target.checked);
              }} />
        </span>
      );
    }
    return (
      <div className={styles.italic}>
        {optionalSpacer}
        {value}
      </div>
    );
  }

  updatePropertyTypeTitle = (title) => {
    EntityDataModelApi.updatePropertyTypeMetaData(this.props.propertyType.id, { title });
  }

  updatePropertyTypeDescription = (description) => {
    EntityDataModelApi.updatePropertyTypeMetaData(this.props.propertyType.id, { description });
  }

  updatePropertyTypePii = (piiField) => {
    EntityDataModelApi.updatePropertyTypeMetaData(this.props.propertyType.id, { piiField });
  }

  updatePropertyTypeFqn = (fqn) => {
    const fqnArray = fqn.split('.');
    if (fqnArray.length !== 2) return Promise.resolve(false);

    return EntityDataModelApi.updatePropertyTypeMetaData(this.props.propertyType.id, {
      type: {
        namespace: fqnArray[0],
        name: fqnArray[1]
      }
    }).then(() => {
      return true;
    }).catch(() => {
      return false;
    });
  }

  render() {
    const prop = this.props.propertyType;
    return (
      <div>
        <InlineEditableControl
            type="text"
            size="small"
            placeholder="Property type full qualified name"
            value={`${prop.type.namespace}.${prop.type.name}`}
            viewOnly={!this.context.isAdmin}
            onChangeConfirm={this.updatePropertyTypeFqn}
            shouldChange={this.shouldUpdatePropertyTypeFqn} />
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
        {this.renderPiiField(prop)}
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default PropertyType;
