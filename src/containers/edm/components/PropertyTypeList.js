import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import PropertyType, { DisplayPropType, DEFAULT_DISPLAY } from './PropertyType';
import { checkAuthorizationRequest } from '../../permissions/PermissionsActionFactory';
import { createAccessCheck } from '../../permissions/PermissionsStorage';

class PropertyTypeList extends React.Component {
  static propTypes = {
    className: PropTypes.string,
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

  renderPermissions() {
    const { display } = this.props;
    if (display.permissions) {
      const title = display.permissions === 'edit' ? 'Permissions' : null;

      return (<div className="propertyTypeListPermissions">{ title }</div>);
    } else {
      return null;
    }
  }

  renderContent() {
    const { propertyTypeIds, entitySetId, display } = this.props;

    if (propertyTypeIds.length > 0) {
      return propertyTypeIds.map((id) => {
        return (<PropertyType entitySetId={entitySetId} display={display} propertyTypeId={id} key={id}/>);
      });
    } else {
      return (<em>No property types</em>);
    }
  }

  render() {
    const { display, className } = this.props;

    return (
      <div className={classnames("propertyTypeList", className)}>
        <div className="propertyTypeListHeader">
          {this.renderPermissions()}
          { display.title ? <div className="propertyTypeTitle">Property Title</div> : null }
          { display.description ? <div className="propertyTypeListDescription">Description</div> : null }
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