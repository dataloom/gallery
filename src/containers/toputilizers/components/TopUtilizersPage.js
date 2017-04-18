import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page.js';
import * as actionFactory from '../TopUtilizersActionFactory';
import { entitySetDetailRequest } from '../../entitysetdetail/EntitySetDetailActionFactories';

class TopUtilizersPage extends React.Component {
  static propTypes = {
    getEntitySetId: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.getEntitySetId();
  }

  render() {
    return (
      <DocumentTitle>
        <Page>
          <Page.Header>
            <Page.Title>Top Utilizers</Page.Title>
          </Page.Header>
          <Page.Body>
            {this.props.children}
          </Page.Body>
        </Page>
      </DocumentTitle>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = {
    getEntitySetId: entitySetDetailRequest.bind(null, ownProps.params.id)
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(null, mapDispatchToProps)(TopUtilizersPage);
