import React, { PropTypes } from 'react';
import { hashHistory } from 'react-router';
import { Button, Modal, Pagination } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { SearchApi } from 'lattice';
import AsyncContent, { ASYNC_STATUS } from '../../../../components/asynccontent/AsyncContent';
import DataModelSearchBox from './DataModelSearchBox';
import EntityTypeSearchResults from './EntityTypeSearchResults';
import { NewEdmObjectInput } from './NewEdmObjectInput';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import styles from '../styles.module.css';

const MAX_HITS = 20;

export default class EntityTypeSearch extends React.Component {

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.shape({
        searchTerm: PropTypes.string,
        page: PropTypes.string
      }).isRequired,
      key: PropTypes.string
    })
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      loadTypesError: false,
      searchTerm: (props.location.query.searchTerm) ? props.location.query.searchTerm : '',
      page: (props.location.query.page) ? props.location.query.page : 1,
      searchResults: [],
      totalHits: 0,
      asyncStatus: (props.location.query.searchTerm) ? ASYNC_STATUS.LOADING : ASYNC_STATUS.PENDING,
      isModalOpen: false
    };
  }

  componentDidMount() {
    if (this.props.location.query.searchTerm) {
      this.executeSearch(this.props.location.query.searchTerm, this.state.page);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.location.key) {
      this.setState({
        searchTerm: (nextProps.location.query.searchTerm) ? nextProps.location.query.searchTerm : '',
        page: (nextProps.location.query.page) ? nextProps.location.query.page : 1,
        searchResults: [],
        totalHits: 0,
        asyncStatus: (nextProps.location.query.searchTerm) ? ASYNC_STATUS.LOADING : ASYNC_STATUS.PENDING
      });
      if (nextProps.location.query.searchTerm) {
        const page = nextProps.location.query.page || 1;
        this.executeSearch(nextProps.location.query.searchTerm, page);
      }
    }
  }

  onUpdate = () => {
    this.executeSearch(this.props.location.query.searchTerm, this.state.page);
  }

  executeSearch = (searchTerm, page) => {
    SearchApi.searchEntityTypes({
      searchTerm,
      page,
      start: ((page - 1) * MAX_HITS),
      maxHits: MAX_HITS
    }).then((response) => {
      this.setState({
        searchResults: response.hits,
        totalHits: response.numHits,
        asyncStatus: ASYNC_STATUS.SUCCESS
      });
    }).catch(() => {
      this.setState({
        asyncStatus: ASYNC_STATUS.ERROR
      });
    });
  }

  newEntityTypeSuccess = () => {
    this.closeModal();
    if (this.props.location.query.searchTerm) {
      this.executeSearch(this.props.location.query.searchTerm, this.state.page);
    }
  }

  onCreateEntityType = () => {
    this.setState({ isModalOpen: true });
  }

  closeModal = () => {
    this.setState({ isModalOpen: false });
  }

  onSearchSubmit = (searchTerm, optionalPage) => {
    const page = optionalPage || 1;
    const query = Object.assign({}, this.props.location.query || {}, { searchTerm, page });
    const newLocation = Object.assign({}, this.props.location, { query });
    hashHistory.push(newLocation);
  }

  renderCreateEntityTypeButton = () => {
    return (
      <div className={styles.createEdmObjectButtonWrapper}>
        <Button bsStyle="primary" className={styles.control} onClick={this.onCreateEntityType}>
          <FontAwesome name="plus-circle" size="lg" /> Entity Type
        </Button>
      </div>
    );
  }

  renderCreateEntityTypeModal = () => {
    return (
      <Modal show={this.state.isModalOpen} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create an entity type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewEdmObjectInput
              namespaces={this.state.allPropNamespaces}
              createSuccess={this.newEntityTypeSuccess}
              edmType={EdmConsts.ENTITY_TYPE_TITLE} />
        </Modal.Body>
      </Modal>
    );
  }

  renderResults = () => {
    if (this.props.location.query.searchTerm && this.state.searchResults.length) {
      return (
        <AsyncContent
            status={this.state.asyncStatus}
            pendingContent="Please run a search."
            content={() => {
              return (
                <EntityTypeSearchResults
                    results={this.state.searchResults}
                    onUpdate={this.onUpdate} />
              );
            }} />);
    }
    return null;
  }

  handlePageSelect = (eventKey) => {
    this.onSearchSubmit(this.state.searchTerm, eventKey);
  }

  renderPagination = () => {
    const activePage = parseInt(this.state.page, 10);
    if (this.state.totalHits <= 0 || isNaN(activePage)) return null;
    const numPages = Math.ceil((1.0 * this.state.totalHits) / MAX_HITS);
    return (
      <div className={styles.viewWrapper}>
        <Pagination
            prev
            next
            ellipsis
            boundaryLinks
            items={numPages}
            maxButtons={5}
            activePage={activePage}
            onSelect={this.handlePageSelect} />
      </div>
    );
  }

  render() {
    let initialSearch = '';
    if (this.props.location && this.props.location.query && this.props.location.query.searchTerm) {
      initialSearch = this.props.location.query.searchTerm;
    }

    return (
      <div>
        {this.renderCreateEntityTypeButton()}
        {this.renderCreateEntityTypeModal()}
        <DataModelSearchBox
            initialSearch={initialSearch}
            onSubmit={this.onSearchSubmit} />
        {this.renderResults()}
        {this.renderPagination()}
      </div>
    );
  }
}
