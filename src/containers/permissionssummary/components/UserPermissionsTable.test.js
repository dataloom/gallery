import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Immutable from 'immutable';
// import configureStore from 'redux-mock-store';

import '../../../../config/chai/chai.config';
import UserPermissionsTable from './UserPermissionsTable';

// const middlewares = []
// const mockStore = configureStore(middlewares);

describe('UserPermissionsTable', function() {
  const headers = ['Emails', 'Roles', 'Permissions'];
  const userPermissions = Immutable.fromJS({
    email: 'test@gmail.com',
    id: '123',
    individualPermissions: ['Read'],
    permissions: ['Read', 'Discover'],
    roles: ['admin', 'user']
  });
  const defaultProps = {
    headers,
    userPermissions
  };

  it('Should render', function() {
    const wrapper = shallow(
      <UserPermissionsTable {...defaultProps} />
    );

    expect(wrapper.length).to.eql(1);
  });

  it('Renders headers', function() {
    const wrapper = shallow(
      <UserPermissionsTable {...defaultProps} />
    );

    expect(wrapper.find('th')).to.have.length(3);
  });

  // it('Renders a row for each role', function() {
  //   const wrapper = mount(
  //     <UserPermissionsTable {...defaultProps} />
  //   );
  //
  //   expect(wrapper.find('.userRow')).to.have.length(3);
  // });
});
