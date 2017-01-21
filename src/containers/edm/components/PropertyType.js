import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import FontAwesome from 'react-fontawesome';

import { PropertyTypePropType } from '../EdmModel';
import { createPropertyTypeReference, getEdmObjectSilent } from '../EdmStorage';
import { PermissionsPropType, getPermissions, DEFAULT_PERMISSIONS } from '../../permissions/PermissionsStorage';
import ExpandableText from '../../../components/utils/ExpandableText';
import styles from './propertype.module.css';

const MAX_DESCRIPTION_LENGTH = 300;

// TODO: Make PropertyType a container that takes a PropertyType reference
class PropertyType extends React.Component {
  static propTypes = {
    propertyTypeId: PropTypes.string.isRequired,
    // Permissions are per-EntitySet. Passing entitySetId implies display permissions
    entitySetId: PropTypes.string,
    // Async Properties
    propertyType: PropertyTypePropType,
    permissions: PermissionsPropType
  };

  renderEmptyProperty() {
    return (
      <div className={classnames(styles.propertyType, styles.empty)}>
        <div className={styles.title}>LOADING!</div>
        <div className={styles.description}></div>
      </div>
    );
  }

  render() {
    const { propertyType, permissions } = this.props;

    if (!propertyType) {
      return this.renderEmptyProperty();
    }

    let description;
    if (propertyType.description) {
      description = (<ExpandableText text={propertyType.description} maxLength={MAX_DESCRIPTION_LENGTH}/>);
    } else {
      description = (<em>No description</em>);
    }

    let lock;
    if (permissions && !permissions.READ) {
      lock = (<FontAwesome name="lock"/>);
    }

    return (
      <div className={styles.propertyType}>
        <div className={styles.title}>{propertyType.title} {lock}</div>
        <div className={styles.description}>
          {description}
        </div>
      </div>
    );
  }
}


function mapStateToProps(state, ownProps) {
  const normalizedData = state.get('normalizedData'),
    permissionsState = state.get('permissions');

  const { entityTypeId, propertyTypeId } = ownProps;
  const reference = createPropertyTypeReference(propertyTypeId);

  let permissions;
  if (entityTypeId) {
    // TODO: Make permissions handle async states properly
    permissions = getPermissions(permissionsState, [entityTypeId, propertyTypeId]);
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