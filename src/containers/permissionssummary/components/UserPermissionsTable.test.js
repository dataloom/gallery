import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Immutable from 'immutable';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import '../../../../config/chai/chai.config';
import UserPermissionsTable from './UserPermissionsTable';

const middlewares = []
const mockStore = configureStore(middlewares);

describe('UserPermissionsTable', function() {
  const headers = ['Users', 'Roles', 'Permissions'];
  const userPermissions = Immutable.fromJS({
    email: 'test@gmail.com',
    id: '123',
    individualPermissions: ['Read'],
    permissions: ['Read', 'Discover'],
    roles: ['admin', 'user']
  });
  const rolePermissions = Immutable.fromJS({
    AuthenticatedUser: ['Read', 'Link', 'Discover'],
    Admin: ['Read'],
    User: []
  });
  const defaultProps = {
    headers,
    userPermissions,
    rolePermissions
  };

  beforeEach(function() {
    const initialState = {};
    const store = mockStore(initialState);
  });

  it('Should render', function() {
    const wrapper = shallow(
      <Provider store={store}>
        <UserPermissionsTable {...defaultProps} />
      </Provider>
    );

    expect(wrapper.length).to.eql(1);
  });
  // 
  // it('Renders headers', function() {
  //   const wrapper = shallow(
  //     <Provider store={store}>
  //       <UserPermissionsTable {...defaultProps} />
  //     </Provider>
  //   );
  //
  //   expect(wrapper.find('th')).to.have.length(3);
  // });

  // it('Renders a row for each role', function() {
  //   const wrapper = mount(
  //     <UserPermissionsTable {...defaultProps} />
  //   );
  //
  //   expect(wrapper.find('.userRow')).to.have.length(3);
  // });
});
