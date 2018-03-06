import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import { connect } from 'react-redux';
import { Pager } from 'react-bootstrap';

import AsyncContent from '../../components/asynccontent/AsyncContent';
import EntitySetList from '../../components/entityset/EntitySetList';
import Page from '../../components/page/Page';
import joinImg from '../../images/icon-join.svg';
import exploreImg from '../../images/icon-explore.svg';
import visualizeImg from '../../images/icon-visualize.svg';
import PageConsts from '../../utils/Consts/PageConsts';
import WelcomeInstructionsBox from './WelcomeInstructionsBox';

import { homeEntitySetsRequest } from './HomeActionFactories';

import {
  fetchAllEntityTypesRequest,
  fetchAllPropertyTypesRequest
} from '../edm/EdmActionFactory';

import styles from './styles.module.css';

const MAX_ENTITY_SETS = 10;

class HomeComponent extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      loadEntitySetPage: PropTypes.func.isRequired,
      fetchAllEntityTypes: PropTypes.func.isRequired,
      fetchAllPropertyTypes: PropTypes.func.isRequired
    }).isRequired,
    asyncState: PropTypes.instanceOf(Immutable.Map).isRequired,
    entitySets: PropTypes.instanceOf(Immutable.Map).isRequired,
    numHits: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 0
    };
  }

  componentDidMount() {
    this.props.actions.loadEntitySetPage(this.state.page);
    this.props.actions.fetchAllEntityTypes();
    this.props.actions.fetchAllPropertyTypes();
  }

  goBack = () => {
    const page = this.state.page - 1;
    this.setState({ page });
    this.props.actions.loadEntitySetPage(page);
  }

  goForward = () => {
    const page = this.state.page + 1;
    this.setState({ page });
    this.props.actions.loadEntitySetPage(page);
  }

  renderAllEntitySets = () => {
    if (this.props.entitySets.size > 0) {
      return (
        <AsyncContent
            status={this.props.asyncState.get('status')}
            errorMessage={this.props.asyncState.get('errorMessage')}
            pendingContent={<h2>Loading entity sets</h2>}
            content={() => {
              return (
                <div>
                  <EntitySetList entitySets={this.props.entitySets} />
                  <Pager>
                    <Pager.Item
                        previous
                        disabled={this.state.page === 0}
                        onClick={this.goBack}>&larr;</Pager.Item>
                    <Pager.Item
                        next
                        disabled={this.props.numHits <= ((this.state.page + 1) * MAX_ENTITY_SETS)}
                        onClick={this.goForward}>&rarr;</Pager.Item>
                  </Pager>
                </div>
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

  const entitySetIds = state.getIn(['home', 'entitySetIds'], Immutable.List());
  let entitySets = Immutable.Map();
  entitySetIds.forEach((entitySetId) => {
    entitySets = entitySets.set(
      entitySetId, state.getIn(['edm', 'entitySets', entitySetId], Immutable.Map())
    );
  });

  return {
    asyncState: state.getIn(['home', 'asyncState'], Immutable.Map()),
    numHits: state.getIn(['home', 'numHits'], 0),
    entitySets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadEntitySetPage: (page) => {
        dispatch(homeEntitySetsRequest(page * MAX_ENTITY_SETS, MAX_ENTITY_SETS));
      },
      fetchAllEntityTypes: () => {
        dispatch(fetchAllEntityTypesRequest());
      },
      fetchAllPropertyTypes: () => {
        dispatch(fetchAllPropertyTypesRequest());
      }
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
