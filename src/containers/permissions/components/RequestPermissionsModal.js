import React, { PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';

import * as actionFactory from '../PermissionsActionFactory';
import PropertyTypeList from '../../edm/components/PropertyTypeList';
import { getEdmObjectSilent, createEntitySetReference } from '../../edm/EdmStorage';
import { EntitySetPropType } from '../../edm/EdmModel';


class RequestPermissions extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    //Async Objects
    entitySet: EntitySetPropType,
    propertyTypeIds: PropTypes.arrayOf(PropTypes.string),
  };

  onSubmit = () => {

  };

  render() {
    const { propertyTypeIds, entitySet, show, onHide } = this.props;

    let title;
    if (entitySet) {
      title = `Request permissions on "${entitySet.title}"`;
    }

    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.onSubmit}>
            <PropertyTypeList propertyTypeIds={propertyTypeIds}/>
            <Button type="submit" bsStyle="primary">Search</Button>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const normalizedData = state.get('normalizedData').toJS(),
    permissions = state.get('permissions');

  const entitySetId = permissions.getIn(['requestPermissionsModal', 'entitySetId']);
  let propertyTypeIds,
    entitySet;
  if (entitySetId) {
    // TODO: Remove denormalization and replace with getting PropertyTypeIds directly
    const reference = createEntitySetReference(entitySetId);
    entitySet = getEdmObjectSilent(normalizedData, reference, null);
    if (entitySet) {
      propertyTypeIds = entitySet.entityType.properties.map(property => property.id);
    }
  }

  return {
    propertyTypeIds,
    entitySet,
    show: permissions.getIn(['requestPermissionsModal', 'show'])
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    onHide: () => { dispatch(actionFactory.requestPermissionsModalHide()); }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestPermissions);