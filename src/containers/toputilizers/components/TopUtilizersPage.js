import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import Page from '../../../components/page/Page';

import {
  entitySetDetailRequest
} from '../../entitysetdetail/EntitySetDetailActionFactory';

class TopUtilizersPage extends React.Component {
  static propTypes = {
    getEntitySetId: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired,
    entitySet: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  componentDidMount() {
    this.props.getEntitySetId();
  }

  render() {
    return (
      <div>
        <Page.Header>
          <Page.Title>Top Utilizers</Page.Title>
          <h3>{this.props.entitySet.get('title')}</h3>
        </Page.Header>
        <Page.Body>
          {this.props.children}
        </Page.Body>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const entitySetDetail = state.get('entitySetDetail');

  return {
    entitySet: entitySetDetail.get('entitySet')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = {
    getEntitySetId: entitySetDetailRequest.bind(null, ownProps.params.id)
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersPage);
