import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import PropertyType, { DisplayPropType, DEFAULT_DISPLAY } from './PropertyType';
import { checkAuthorizationRequest } from '../../permissions/PermissionsActionFactory';
import { createAccessCheck } from '../../permissions/PermissionsStorage';
import styles from './propertype.module.css';

class PropertyTypeList extends React.Component {
  static propTypes = {
    propertyTypeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    display: DisplayPropType,
    // Implies permissions view
    entitySetId: PropTypes.string,
    loadPermissions: PropTypes.func.isRequired
  };

  static defaultProps = {
    display: DEFAULT_DISPLAY
  };

  componentDidMount() {
    this.props.loadPermissions();
  }

  render() {
    const { propertyTypeIds, entitySetId, display } = this.props;

    let content;
    if (propertyTypeIds.length > 0) {
      content = propertyTypeIds.map((id) => {
        return (<PropertyType entitySetId={entitySetId} propertyTypeId={id} key={id}/>);
      });
    } else {
      content = (<em>No property types</em>);
    }

    const permissionsTitle = display.permissions === 'edit' ? 'Permissions' : null;

    return (
      <div className={styles.propertyTypeList}>
        <div className={styles.propertyTypeListHeader}>
          <div className={styles.permissions}>{permissionsTitle}</div>
          <div className={styles.title}>Property Title</div>
          <div className={styles.description}>Description</div>
        </div>
        {content}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const { entitySetId, propertyTypeIds } = ownProps;

  let loadPermissions;
  if (entitySetId) {
    const accessChecks = propertyTypeIds.map(id => {
      return createAccessCheck([entitySetId, id]);
    });
    loadPermissions = () => {
      dispatch(checkAuthorizationRequest(accessChecks));
    };
  } else {
    loadPermissions = () => {};
  }

  return {
    loadPermissions
  }
}

export default connect(null, mapDispatchToProps)(PropertyTypeList);