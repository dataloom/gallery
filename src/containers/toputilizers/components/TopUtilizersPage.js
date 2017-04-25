import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page';
import { entitySetDetailRequest } from '../../entitysetdetail/EntitySetDetailActionFactories';

class TopUtilizersPage extends React.Component {
  static propTypes = {
    getEntitySetId: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired
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
