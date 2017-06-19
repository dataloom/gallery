/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';

import { Modal } from 'react-bootstrap';

import styles from './entitysetdetail.module.css';

const IntegrationDetailsModal = ({ isOpen, onClose, entitySet }) => {
  const getKeyListItems = () => {
    const keys = entitySet.getIn(['entityType', 'key'], Immutable.List());
    const properties = entitySet.getIn(['entityType', 'properties'], Immutable.List());

    return keys.map((key) => {
      let name;
      let namespace;
      properties.forEach((property) => {
        if (property.id === key) {
          name = property.type.name;
          namespace = property.type.namespace;
        }
      });
      return (<li key={key}>{namespace}.{name}</li>);
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
              {entitySet.getIn(['entityType', 'type', 'namespace'])}.{entitySet.getIn(['entityType', 'type', 'name'])}
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
  };

  const getPropertyListItems = () => {

    // const properties = entitySet.getIn(['entityType', 'properties'], Immutable.List());
    // console.log(properties);
    // console.log(properties.toJS());
    // // return properties.map((property :Map) => (
    // //   <li key={property.get('id')}><b>{property.get('title')}: </b>{property.type.namespace}.{property.type.name}</li>
    // // ));
    // const listItems = [];
    // properties.forEach((propertyId, property) => {
    //   console.log(propertyId, property);
    // });

    return [];
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
  entitySet: PropTypes.instanceOf(Immutable.Map).isRequired
};

export default IntegrationDetailsModal;
