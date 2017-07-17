/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';

import { Modal } from 'react-bootstrap';

import styles from './entitysetdetail.module.css';

const IntegrationDetailsModal = ({ isOpen, onClose, entitySet, entityType, propertyTypes }) => {
  const getKeyListItems = () => {
    const keys = entityType.get('key', Immutable.List());
    return keys.map((key) => {
      let name;
      let namespace;
      propertyTypes.forEach((property) => {
        if (property.get('id') === key) {
          name = property.getIn(['type', 'name'], '');
          namespace = property.getIn(['type', 'namespace'], '');
        }
      });
      return (<li key={`{key-${key}}`}>{namespace}.{name}</li>);
    });
  };

  const getEntityDetails = () => {
    if (!entitySet.isEmpty()) {
      return (
        <div>
          <h5>Entity Details</h5>
          <ul className={styles.list}>
            <li><b>Entity Set Name: </b>{entitySet.get('name')}</li>
            <li>
              <b>Entity Set Type: </b>
              {entityType.getIn(['type', 'namespace'])}.{entityType.getIn(['type', 'name'])}
            </li>
            <li><b>Primary Key(s): </b>
              <ul>
                {getKeyListItems()}
              </ul>
            </li>
          </ul>
        </div>
      );
    }
    return null;
  };

  const getPropertyListItems = () => {
    return propertyTypes.map((propertyType) => {
      const name = propertyType.getIn(['type', 'name'], '');
      const namespace = propertyType.getIn(['type', 'namespace'], '');
      const title = propertyType.get('title');
      return (<li key={`pt-${propertyType.get('id')}`}><b>{title}: </b>{namespace}.{name}</li>);
    });
  };

  const getPropertyDetails = () => {
    if (!entitySet.isEmpty()) {
      return (
        <div>
          <h5>Property Details</h5>
          <ul className={styles.list}>
            {getPropertyListItems()}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <Modal
        show={isOpen}
        onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Integration Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {getEntityDetails()}
        {getPropertyDetails()}
      </Modal.Body>
    </Modal>
  );
};

IntegrationDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  entitySet: PropTypes.instanceOf(Immutable.Map).isRequired,
  entityType: PropTypes.instanceOf(Immutable.Map).isRequired,
  propertyTypes: PropTypes.array.isRequired
};

export default IntegrationDetailsModal;
