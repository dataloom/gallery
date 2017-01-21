import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { SplitButton, Button, MenuItem } from 'react-bootstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { DataApi } from 'loom-data';

import { getEdmObjectSilent, createEntitySetReference } from '../../edm/EdmStorage';
import FileConsts from '../../../utils/Consts/FileConsts';
import PageConsts from '../../../utils/Consts/PageConsts';

class ActionDropdown extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired,
    showDetails: PropTypes.bool,
    className: PropTypes.string,
    // Async props
    entityTypeId: PropTypes.string,
    propertyTypeIds: PropTypes.arrayOf(PropTypes.string)
  };

  render() {
    const { entitySetId, entityTypeId } = this.props;

    let details;
    if (this.props.showDetails) {
      details = (
        <li role="presentation">
          <Link to={`/entitysets/${entitySetId}`}>
            View Details
          </Link>
        </li>
      );
    }

    return (
      <SplitButton pullRight title="Actions" id="action-dropdown" className={classnames(this.props.className)}>
        {details}
        <MenuItem header>Download</MenuItem>
        <MenuItem href={DataApi.getEntitySetDataFileUrl(entitySetId, FileConsts.CSV)}>CSV</MenuItem>
        <MenuItem href={DataApi.getEntitySetDataFileUrl(entitySetId, FileConsts.JSON)}>JSON</MenuItem>
        <MenuItem divider/>
        <li role="presentation">
          <Link
            to={{
              pathname: `/${PageConsts.VISUALIZE}`,
              query: {
                setId: entitySetId,
                typeId: entityTypeId
              }
            }}>
            Visualize
          </Link>
        </li>
      </SplitButton>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const normalizedData = state.get('normalizedData').toJS(),
    permissions = state.get('permissions');

  const { entitySetId } = ownProps;

  let propertyTypeIds,
    entityTypeId;
  // TODO: Remove denormalization and replace with getting PropertyTypeIds directly
  const reference = createEntitySetReference(entitySetId);
  const entitySet = getEdmObjectSilent(normalizedData, reference, null);
  if (entitySet) {
    entityTypeId = entitySet.entityType.id;
    propertyTypeIds = entitySet.entityType.properties.map(property => property.id);
  }

  return {
    propertyTypeIds,
    entityTypeId
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionDropdown);