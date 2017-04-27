import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';
import Immutable from 'immutable';

import Page from '../../../components/page/Page';
import { entitySetDetailRequest } from '../../entitysetdetail/EntitySetDetailActionFactories';

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
      <DocumentTitle title="Top Utilizers">
        <Page>
          <Page.Header>
            <Page.Title>Top Utilizers</Page.Title>
            <h3>{this.props.entitySet.get('title')}</h3>
          </Page.Header>
          <Page.Body>
            {this.props.children}
          </Page.Body>
        </Page>
      </DocumentTitle>
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
