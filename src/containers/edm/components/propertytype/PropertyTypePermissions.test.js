import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import '../../../../../config/chai/chai.config';
import { PropertyTypeEditPermissions } from './PropertyTypePermissions';
import { PERMISSIONS } from '../../../permissions/PermissionsStorage';


describe('PropertyTypePermissions', function() {
  const propertyType = {
    id: 'abc',
    title: 'Test Property',
    description: 'Property Description',
    datatype: 'propDataType'
  };

  describe('PropertyTypePermissionsEdit', function() {
    const permissions = {
      DISCOVER: true,
      LINK: true,
      READ: false,
      WRITE: false,
      OWNER: false
    };

    const permissionsWithRead = {
      DISCOVER: true,
      LINK: true,
      READ: true,
      WRITE: false,
      OWNER: false
    };

    // TODO: Change to Permission statuses instead of permission objects
    it('should emit permission with read when checked', function() {
      const onChange = sinon.spy();
      const wrapper = shallow(
        <PropertyTypeEditPermissions
            onChange={onChange}
            propertyType={propertyType}
            permissions={permissions} />
      );

      wrapper.find({ type: 'checkbox' }).simulate('change', { target: { checked: true } });

      expect(onChange).to.have.been.calledWith(propertyType.id, [PERMISSIONS.READ]);
    });

    it('should emit permission without read when unchecked', function() {
      const onChange = sinon.spy();
      const wrapper = shallow(
        <PropertyTypeEditPermissions
            onChange={onChange}
            propertyType={propertyType}
            permissions={permissionsWithRead} />
      );

      wrapper.find({ type: 'checkbox' }).simulate('change', { target: { checked: false } });

      expect(onChange).to.have.been.calledWith(propertyType.id, []);
    });

    it('should render checked with read permission', function() {
      const onChange = sinon.spy();

      const wrapper = shallow(
        <PropertyTypeEditPermissions
            onChange={onChange}
            propertyType={propertyType}
            permissions={permissionsWithRead} />
      );
      expect(wrapper.find({ type: 'checkbox' })).to.be.checked();
    });
  });
});
