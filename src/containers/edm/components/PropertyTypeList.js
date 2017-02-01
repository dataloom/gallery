import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import PropertyType, { EditingPropType, DEFAULT_EDITING } from './PropertyType';
import { checkAuthorizationRequest } from '../../permissions/PermissionsActionFactory';
import { createAccessCheck } from '../../permissions/PermissionsStorage';

class PropertyTypeList extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    propertyTypeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    editing: EditingPropType,
    onChange: PropTypes.func,
    // Implies permissions view
    entitySetId: PropTypes.string,
    loadPermissions: PropTypes.func.isRequired
  };

  static defaultProps = {
    display: DEFAULT_EDITING
  };

  componentDidMount() {
    this.props.loadPermissions();
  }

  renderContent() {
    const { propertyTypeIds, entitySetId, editing, onChange } = this.props;

    if (propertyTypeIds.length > 0) {
      return propertyTypeIds.map((id) => {
        return (
          <PropertyType
            entitySetId={entitySetId}
            editing={editing}
            propertyTypeId={id}
            key={id}
            onChange={onChange}
          />
        );
      });
    } else {
      return (<em>No property types</em>);
    }
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames("propertyTypeList", className)}>
        <div className="propertyTypeListHeader">
          <div className="propertyTypeListPermissions"></div>
          <div className="propertyTypeTitle">Property Title</div>
          <div className="propertyTypeListDescription">Description</div>
          <div className="propertyTypeListControls"></div>
        </div>
        {this.renderContent()}
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