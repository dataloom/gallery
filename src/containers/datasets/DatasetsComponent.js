import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
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
    ownedEntitySets: PropTypes.array.isRequired,
    asyncStatus: AsyncStatePropType.isRequired,
    finishedLoading: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired
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

  renderLoadMore = () => {
    if (this.props.finishedLoading) return null;
    return (
      <div className={styles.continueButtonContainer}>
        <Button bsStyle="info" onClick={this.loadPage}>Load more datasets</Button>
      </div>
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
                  {this.renderLoadMore()}
                </div>
              )}
          />
        </Page.Body>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  const datasets = state.get('datasets').toJS();
  return {
    pagingToken: datasets.pagingToken,
    ownedEntitySets: datasets.entitySets,
    asyncStatus: datasets.asyncStatus,
    finishedLoading: datasets.finishedLoading,
    errorMessage: datasets.errorMessage
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
