import React, { PropTypes } from 'react';
import { hashHistory } from 'react-router';
import { Button, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { SearchApi } from 'loom-data';
import AsyncContent, { ASYNC_STATUS } from '../../../../components/asynccontent/AsyncContent';
import DataModelSearchBox from './DataModelSearchBox';
import PropertyTypeSearchResults from './PropertyTypeSearchResults';
import { NewEdmObjectInput } from './NewEdmObjectInput';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import styles from '../styles.module.css';

export default class PropertyTypeSearch extends React.Component {

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
      this.executeSearch(this.props.location.query.searchTerm);
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
        this.executeSearch(nextProps.location.query.searchTerm);
      }
    }
  }

  onUpdate = () => {
    this.executeSearch(this.props.location.query.searchTerm);
  }

  executeSearch = (searchTerm) => {
    SearchApi.searchPropertyTypes({
      searchTerm,
      start: 0,
      maxHits: 20
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

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  newPropertyTypeSuccess = () => {
    if (this.props.location.query.searchTerm) {
      this.executeSearch(this.props.location.query.searchTerm);
    }
  }

  onCreatePropertyType = () => {
    this.setState({ isModalOpen: true });
  }

  closeModal = () => {
    this.setState({ isModalOpen: false });
  }

  onSearchSubmit = (searchTerm) => {
    const query = Object.assign({}, this.props.location.query || {}, { searchTerm });
    const newLocation = Object.assign({}, this.props.location, { query });
    hashHistory.push(newLocation);
  }

  renderCreatePropertyTypeButton = () => {
    return (
      <div className={styles.createEdmObjectButtonWrapper}>
        <Button bsStyle="primary" className={styles.control} onClick={this.onCreatePropertyType}>
          <FontAwesome name="plus-circle" size="lg" /> Property Type
        </Button>
      </div>
    );
  }

  renderCreatePropertyTypeModal = () => {
    return (
      <Modal show={this.state.isModalOpen} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create a property type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewEdmObjectInput
              createSuccess={this.newPropertyTypeSuccess}
              edmType={EdmConsts.PROPERTY_TYPE_TITLE}
              noButton />
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
                <PropertyTypeSearchResults
                    results={this.state.searchResults}
                    onUpdate={this.onUpdate} />
              );
            }} />);
    }
    return null;
  }

  render() {
    let initialSearch = '';
    if (this.props.location && this.props.location.query && this.props.location.query.searchTerm) {
      initialSearch = this.props.location.query.searchTerm;
    }

    return (
      <div>
        {this.renderCreatePropertyTypeButton()}
        {this.renderCreatePropertyTypeModal()}
        <DataModelSearchBox
            initialSearch={initialSearch} onSubmit={this.onSearchSubmit} />
        {this.renderResults()}
      </div>
    );
  }
}
