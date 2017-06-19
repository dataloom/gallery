/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncContent from '../../components/asynccontent/AsyncContent';
import EntitySetList from '../../components/entityset/EntitySetList';
import Page from '../../components/page/Page';
import joinImg from '../../images/icon-join.svg';
import exploreImg from '../../images/icon-explore.svg';
import visualizeImg from '../../images/icon-visualize.svg';
import PageConsts from '../../utils/Consts/PageConsts';
import WelcomeInstructionsBox from './WelcomeInstructionsBox';

import {
  fetchAllEntitySetsRequest,
  fetchAllEntityTypesRequest,
  fetchAllPropertyTypesRequest
} from '../edm/EdmActionFactory';

import styles from './styles.module.css';

class HomeComponent extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      fetchAllEntitySetsRequest: PropTypes.func.isRequired,
      fetchAllEntityTypesRequest: PropTypes.func.isRequired,
      fetchAllPropertyTypesRequest: PropTypes.func.isRequired
    }).isRequired,
    asyncState: PropTypes.instanceOf(Immutable.Map).isRequired,
    entitySets: PropTypes.instanceOf(Immutable.Map).isRequired
  };

  componentDidMount() {

    this.props.actions.fetchAllEntitySetsRequest();
    this.props.actions.fetchAllEntityTypesRequest();
    this.props.actions.fetchAllPropertyTypesRequest();
  }

  renderAllEntitySets = () => {

    if (this.props.entitySets.size > 0) {
      return (
        <AsyncContent
            status={this.props.asyncState.get('status')}
            pendingContent={<h2>Please run a search</h2>}
            content={() => {
              return (
                <EntitySetList entitySets={this.props.entitySets} />
              );
            }} />
      );
    }

    return null;
  }

  render() {
    return (
      <DocumentTitle title="Home">
        <Page>
          <Page.Header>
            <Page.Title>Welcome!</Page.Title>
            <div className={styles.welcomeInstructionsContainer}>
              <WelcomeInstructionsBox
                  title="JOIN"
                  description="Find the organizations to which you belong or with the data you need and request access."
                  imgSrc={joinImg}
                  linkRoute={PageConsts.ORGS} />
              <WelcomeInstructionsBox
                  title="EXPLORE"
                  description="See the data available to you and download Excel and .JSON files to analyze each property."
                  imgSrc={exploreImg}
                  linkRoute={PageConsts.CATALOG} />
              <WelcomeInstructionsBox
                  title="VISUALIZE"
                  description="Use our visualization tools to easily organize, analyze, and share data with those who need it."
                  imgSrc={visualizeImg}
                  linkRoute={PageConsts.VISUALIZE} />
            </div>
          </Page.Header>
          <Page.Body>
            <div className={styles.getStartedMessage}>Get started by exploring entity sets you can view
            </div>
            {this.renderAllEntitySets()}
          </Page.Body>
        </Page>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {

  return {
    asyncState: state.getIn(['edm', 'asyncState'], Immutable.Map()),
    entitySets: state.getIn(['edm', 'entitySets'], Immutable.Map())
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    fetchAllEntitySetsRequest,
    fetchAllEntityTypesRequest,
    fetchAllPropertyTypesRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
