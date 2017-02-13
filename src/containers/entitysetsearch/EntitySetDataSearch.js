import React from 'react';
import axios from 'axios';
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
      asyncStatus: ASYNC_STATUS.PENDING
    }
  }

  executeSearch = (searchTerm) => {
    axios({
      method: 'post',
      url: `http://localhost:8080/datastore/search/${this.props.params.entitySetId}`,
      data: searchTerm,
      headers: {
        'Content-Type': 'application/json',
        Authentication: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InN1cHBvcnRAa3J5cHRub3N0aWMuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJhcHBfbWV0YWRhdGEiOnsicm9sZXMiOlsiRGVtbyIsImFkbWluIiwiSkJJX09QUyIsIkF1dGhlbnRpY2F0ZWRVc2VyIiwidXNlciIsIkpCSV9BRE1JTiJdLCJvcmdhbml6YXRpb25zIjpbIjcyMTFiNmFlLTUzNzUtNDJkMi1iOTgwLTE4YjkyM2YzY2IyYiIsImFkbWluIiwiQXV0aGVudGljYXRlZFVzZXIiLCJ1c2VyIl19LCJuaWNrbmFtZSI6InN1cHBvcnQiLCJyb2xlcyI6WyJEZW1vIiwiYWRtaW4iLCJKQklfT1BTIiwiQXV0aGVudGljYXRlZFVzZXIiLCJ1c2VyIiwiSkJJX0FETUlOIl0sInVzZXJfaWQiOiJhdXRoMHw1N2U0YjJkOGQ5ZDFkMTk0Nzc4ZmQ1YjYiLCJpc3MiOiJodHRwczovL2xvb20uYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU3ZTRiMmQ4ZDlkMWQxOTQ3NzhmZDViNiIsImF1ZCI6IlBUbXlFeGRCY2tIQWl5T2poNHcyTXFTSVVHV1dFZGY4IiwiZXhwIjoxNDg2OTgzNjIwLCJpYXQiOjE0ODY5NDc2MjB9.pRpt3TB0giowS-4w7zPoORsTApN9b16hGXXZ5_pYUvQ'
      }
    }).then((response) => {
      this.setState({
        searchResults: response.data,
        asyncStatus: ASYNC_STATUS.SUCCESS
      });
    }).catch(() => {
      this.setState({ asyncStatus: ASYNC_STATUS.ERROR });
    });
  }

  onSearchSubmit = (searchTerm) => {
    this.executeSearch(searchTerm);
    this.setState({
      searchTerm,
      asyncStatus: ASYNC_STATUS.LOADING
    });
  }

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Search entity set data</Page.Title>
          <EntitySetSearchBox onSubmit={this.onSearchSubmit} />
        </Page.Header>
        <Page.Body>
          <AsyncContent
              status={this.state.asyncStatus}
              pendingContent={<h2>Please run a search</h2>}
              content={() => <EntitySetSearchResults results={this.state.searchResults} />} />
        </Page.Body>
      </Page>
    );
  }


}
