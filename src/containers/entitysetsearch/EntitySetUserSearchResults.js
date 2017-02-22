import React, { PropTypes } from 'react';
import UserRow from './UserRow';

export default class EntitySetUserSearchResults extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    firstName: PropTypes.object.isRequired,
    lastName: PropTypes.object.isRequired,
    dob: PropTypes.object,
    hidePaginationFn: PropTypes.func,
    formatValueFn: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      results: props.results,
      selectedRow: undefined
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      results: nextProps.results
    });
  }

  onUserSelect = (row) => {
    this.setState({ selectedRow: row });
    this.props.hidePaginationFn(true);
  }

  onUserDeselect = () => {
    this.setState({ selectedRow: undefined });
    this.props.hidePaginationFn(false);
  }

  renderAllUserResults = () => {
    const firstNameId = this.props.firstName.id;
    const lastNameId = this.props.lastName.id;
    const resultRows = [];
    this.state.results.forEach((row) => {
      const propertyTypeIds = Object.keys(row);
      if (propertyTypeIds.includes(firstNameId) && propertyTypeIds.includes(lastNameId)) {
        resultRows.push(
          <UserRow
              key={this.state.results.indexOf(row)}
              row={row}
              propertyTypes={this.props.propertyTypes}
              firstName={this.props.firstName}
              lastName={this.props.lastName}
              dob={this.props.dob}
              selectUserFn={this.onUserSelect}
              formatValueFn={this.props.formatValueFn} />
        );
      }
    });
    return resultRows;
  }

  renderSingleUser = () => {
    return (
      <UserRow
          row={this.state.selectedRow}
          propertyTypes={this.props.propertyTypes}
          firstName={this.props.firstName}
          lastName={this.props.lastName}
          dob={this.props.dob}
          backFn={this.onUserDeselect}
          userPage
          formatValueFn={this.props.formatValueFn} />
    );
  }

  renderResults = () => {
    if (this.state.selectedRow) return this.renderSingleUser()
    return this.renderAllUserResults();
  }

  renderNoResults = () => {
    return (
      <div>There are no results to display.</div>
    );
  }

  render() {
    const content = (this.state.results.length < 1) ? this.renderNoResults() : this.renderResults();
    return (
      <div>{content}</div>
    );
  }
}
