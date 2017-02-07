/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state :Immutable.Map<*, *>) {

  return {};
}

function mapDispatchToProps(dispatch :Function) {

  return {};
}

class OrganizationsListComponent extends React.Component {

  render() {

    return (
      <div>List of Organizations...</div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsListComponent);
