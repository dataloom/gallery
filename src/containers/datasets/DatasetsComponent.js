import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Button, Modal, Pager } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { getOwnedDatasetsIdsRequest } from './DatasetsActionFactory';
import Page from '../../components/page/Page';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import EntitySetList from '../../components/entityset/EntitySetList';
import CreateEntitySet from '../entitysetforms/CreateEntitySet';
import styles from './datasets.module.css';

class DatasetsComponent extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    pagingToken: PropTypes.string,
    actions: PropTypes.shape({
      getOwnedDatasetsIdsRequest: PropTypes.func.isRequired
    }).isRequired,
    ownedEntitySets: PropTypes.instanceOf(Immutable.List).isRequired,
    asyncStatus: AsyncStatePropType.isRequired,
    finishedLoading: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    allPagingTokens: PropTypes.instanceOf(Immutable.List).isRequired,
    page: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    };
  }

  componentDidMount() {
    this.loadPage();
  }

  onAddDataset = () => {
    this.setState({
      isModalOpen: true
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false
    });
  };

  getDefaultContact = () => {
    const profile = this.props.auth.getProfile();
    let defaultContact = '';
    if (profile.given_name) defaultContact = defaultContact.concat(`${profile.given_name} `);
    if (profile.family_name) defaultContact = defaultContact.concat(`${profile.family_name} `);
    if (profile.email) defaultContact = defaultContact.concat(`<${profile.email}>`);
    return defaultContact;
  }

  loadPage = () => {
    if (!this.props.finishedLoading) {
      this.props.actions.getOwnedDatasetsIdsRequest(this.props.pagingToken);
    }
  }

  /*
   * This is "this.props.page - 2" because pages are 1-indexed, whereas this.props.allPagingTokens
   * is 0-indexed. To go from page 2 to page 1, we need to use the paging token at index 0
   * (i.e. "this.props.page - 2")
   */
  goBack = () => {
    this.props.actions.getOwnedDatasetsIdsRequest(this.props.allPagingTokens.get(this.props.page - 2));
  }

  goForward = () => {
    this.props.actions.getOwnedDatasetsIdsRequest(this.props.allPagingTokens.get(this.props.page));
  }

  renderPagination = () => {
    if (this.props.allPagingTokens.size === 1 && this.props.finishedLoading) return null;
    const canGoBack = this.props.page > 1;
    let canGoForward = this.props.page < this.props.allPagingTokens.size;
    if (this.props.page === this.props.allPagingTokens.size && !this.props.finishedLoading) canGoForward = true;
    return (
      <Pager>
        <Pager.Item
            previous
            disabled={!canGoBack}
            href="#"
            onClick={this.goBack}>&larr; Previous</Pager.Item>
        <Pager.Item
            next
            disabled={!canGoForward}
            href="#"
            onClick={this.goForward}>Next &rarr;</Pager.Item>
      </Pager>
    );
  }

  render() {
    const { isModalOpen } = this.state;

    return (
      <Page className={styles.datasets}>
        <Page.Header className={styles.pageHeader}>
          <Page.Title className={styles.pageTitle}>Your datasets</Page.Title>
          <Button bsStyle="primary" className={styles.control} onClick={this.onAddDataset}>
            <FontAwesome name="plus-circle" size="lg"/> Dataset
          </Button>
        </Page.Header>

        <Modal show={isModalOpen} onHide={this.closeModal} container={this}>
          <Modal.Header closeButton>
            <Modal.Title>Create a dataset</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateEntitySet defaultContact={this.getDefaultContact()} />
          </Modal.Body>
        </Modal>

        <Page.Body>
          <AsyncContent
              status={this.props.asyncStatus}
              errorMessage={this.props.errorMessage}
              content={() => (
                <div>
                  <EntitySetList entitySets={this.props.ownedEntitySets} />
                </div>
              )}
          />
          {this.renderPagination()}
        </Page.Body>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  const pagingToken = state.getIn(['datasets', 'pagingToken']);
  const allPagingTokens = state.getIn(['datasets', 'allPagingTokens']);
  const page = (pagingToken) ? allPagingTokens.indexOf(pagingToken) : allPagingTokens.size;
  return {
    pagingToken,
    ownedEntitySets: state.getIn(['datasets', 'entitySets']),
    asyncStatus: state.getIn(['datasets', 'asyncStatus']),
    finishedLoading: state.getIn(['datasets', 'finishedLoading']),
    errorMessage: state.getIn(['datasets', 'errorMessage']),
    allPagingTokens,
    page
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  const actions = {
    getOwnedDatasetsIdsRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DatasetsComponent);
