import React from 'react';
import Promise from 'bluebird';
import { SearchApi, EntityDataModelApi } from 'loom-data';
import Page from '../../components/page/Page';
import EntitySetSearchBox from './EntitySetSearchBox';
import EntitySetSearchResults from './EntitySetSearchResults';
import AsyncContent, { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';
import styles from './styles.module.css';

export default class EntitySetDataSearch extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      entitySetId: React.PropTypes.string.isRequired
    }).isRequired
  }

  constructor() {
    super();
    this.state = {
      searchTerm: '',
      searchResults: '',
      title: '',
      asyncStatus: ASYNC_STATUS.PENDING,
      propertyTypes: [],
      loadError: false
    };
  }

  componentDidMount() {
    this.loadPropertyTypes();
  }

  loadPropertyTypes = () => {
    EntityDataModelApi.getEntitySet(this.props.params.entitySetId)
    .then((entitySet) => {
      EntityDataModelApi.getEntityType(entitySet.entityTypeId)
      .then((entityType) => {
        Promise.map(entityType.properties, (propertyId) => {
          return EntityDataModelApi.getPropertyType(propertyId);
        }).then((propertyTypes) => {
          this.setState({
            propertyTypes,
            title: entitySet.title,
            loadError: false
          });
        }).catch(() => {
          this.setState({ loadError: true });
        });
      }).catch(() => {
        this.setState({ loadError: true });
      });
    }).catch(() => {
      this.setState({ loadError: true });
    })
  }

  executeSearch = (searchTerm) => {
    SearchApi.searchEntitySetData(this.props.params.entitySetId, searchTerm)
    .then((response) => {
      this.setState({
        searchResults: response,
        asyncStatus: ASYNC_STATUS.SUCCESS
      });
    }).catch(() => {
      this.setState({ asyncStatus: ASYNC_STATUS.ERROR });
    });
  }

  onSearchSubmit = (searchTerm) => {
    if (searchTerm.length >= 1) {
      this.executeSearch(searchTerm);
      this.setState({
        searchTerm,
        asyncStatus: ASYNC_STATUS.LOADING
      });
    }
  }

  renderEntitySetTitle = () => {
    return (this.state.title.length > 0) ? `: ${this.state.title}` : '';
  }

  renderErrorMessage = () => {
    if (this.state.loadError) {
      return <div className={styles.error}>Unable to load entity set info.</div>;
    }
    return null;
  }

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Search entity set{this.renderEntitySetTitle()}</Page.Title>
          <EntitySetSearchBox onSubmit={this.onSearchSubmit} />
        </Page.Header>
        <Page.Body>
          {this.renderErrorMessage()}
          <AsyncContent
              status={this.state.asyncStatus}
              pendingContent={<h2>Please run a search</h2>}
              content={() => {
                return (<EntitySetSearchResults
                    results={this.state.searchResults}
                    propertyTypes={this.state.propertyTypes} />);
              }} />
        </Page.Body>
      </Page>
    );
  }


}
