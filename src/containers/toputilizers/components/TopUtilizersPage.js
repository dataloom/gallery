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
    entitySet: PropTypes.object.isRequired,
    children: PropTypes.array.isRequired
  }

  componentDidMount() {
    this.props.getEntitySetId();
  }

  getEntitySetTitle = () => {
    return this.props.entitySet ? this.props.entitySet.title : null;
  }

  render() {
    return (
      <DocumentTitle>
        <Page>
          <Page.Header>
            <Page.Title>Top Utilizers</Page.Title>
            <h3>{this.getEntitySetTitle()}</h3>
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
