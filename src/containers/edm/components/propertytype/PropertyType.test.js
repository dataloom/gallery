import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';

import '../../../../../config/chai/plugins.config';
import { PropertyTypeEditPermissions } from './PropertyType';


describe('PropertyType', function() {
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
      const wrapper = mount(
        <PropertyTypeEditPermissions
            onChange={onChange}
            propertyType={propertyType}
            permissions={permissions} />
      );

      wrapper.find({ type: 'checkbox' }).simulate('change', { target: { checked: true } });

      expect(onChange).to.have.been.calledWith(propertyType.id, {
        permissions: permissionsWithRead
      });
    });

    it('should emit permission without read when unchecked', function() {
      const onChange = sinon.spy();
      const wrapper = mount(
        <PropertyTypeEditPermissions
          onChange={onChange}
          propertyType={propertyType}
          permissions={permissionsWithRead} />
      );

      wrapper.find({ type: 'checkbox' }).simulate('change', { target: { checked: false } });

      expect(onChange).to.have.been.calledWith(propertyType.id, {
        permissions
      });
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
