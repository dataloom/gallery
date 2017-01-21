import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import FontAwesome from 'react-fontawesome';

import { PropertyTypePropType } from '../EdmModel';
import { createPropertyTypeReference, getEdmObjectSilent } from '../EdmStorage';
import { PermissionsPropType, getPermissions } from '../../permissions/PermissionsStorage';
import ExpandableText from '../../../components/utils/ExpandableText';
import styles from './propertype.module.css';

const MAX_DESCRIPTION_LENGTH = 300;

export const DisplayPropType = PropTypes.shape({
  permissions: PropTypes.oneOf([true, false, 'edit']),
  title: PropTypes.bool,
  description: PropTypes.bool
});

export const DEFAULT_DISPLAY = {
    permissions: true,
    title: true,
    description: true
};

// TODO: Make PropertyType a container that takes a PropertyType reference
class PropertyType extends React.Component {
  static propTypes = {
    propertyTypeId: PropTypes.string.isRequired,
    display: DisplayPropType,
    // Permissions are per-EntitySet. Passing entitySetId implies display permissions
    entitySetId: PropTypes.string,
    // Async Properties
    propertyType: PropertyTypePropType,
    permissions: PermissionsPropType
  };

  static defaultProps = {
    display: DEFAULT_DISPLAY
  };

  renderPermissions() {
    // Only support READ for now
    const { display, permissions } = this.props;

    if (display.permissions === 'edit') {
      //TODO
    } else if (display.permissions) {
      let content;
      if (permissions && !permissions.READ) {
       content =  (<FontAwesome name="lock"/>);
      }
      return (<div className={styles.permissions}>{content}</div>);
    } else {
      return null;
    }
  }

  renderTitle() {
    const { display, propertyType } = this.props;

    if (display.title) {
      let content;
      if (propertyType) {
        content = propertyType.title;
      }
      return (<div className={styles.title}>{content}</div>);
    } else {
      return null;
    }
  }

  renderDescription() {
    const { display, propertyType } = this.props;

    if (display.description) {
      let content;
      if (propertyType) {
        if (propertyType.description) {
          content = (<ExpandableText text={propertyType.description} maxLength={MAX_DESCRIPTION_LENGTH}/>);
        } else {
          content = (<em>No description</em>);
        }
      }

      return (<div className={styles.description}>{content}</div>);
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className={styles.propertyType}>
        {this.renderPermissions()}
        {this.renderTitle()}
        {this.renderDescription()}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const normalizedData = state.get('normalizedData'),
    permissionsState = state.get('permissions');

  const { entitySetId, propertyTypeId } = ownProps;
  const reference = createPropertyTypeReference(propertyTypeId);

  let permissions;
  if (entitySetId) {
    // TODO: Make permissions handle async states properly
    permissions = getPermissions(permissionsState, [entitySetId, propertyTypeId]);
  }

  return {
    propertyType: getEdmObjectSilent(normalizedData.toJS(), reference, null),
    permissions
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyType);