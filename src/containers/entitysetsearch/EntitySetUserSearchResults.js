import React, { PropTypes } from 'react';
import UserRow from './UserRow';

export default class EntitySetUserSearchResults extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    firstName: PropTypes.object.isRequired,
    lastName: PropTypes.object.isRequired,
    dob: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      results: props.results
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      results: nextProps.results
    });
  }

  renderUserResults = () => {
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
              dob={this.props.dob} />
        );
      }
    });
    return resultRows;
  }

  renderNoResults = () => {
    return (
      <div>There are no results to display.</div>
    );
  }

  render() {
    const content = (this.state.results.length < 1) ? this.renderNoResults() : this.renderUserResults();
    return (
      <div>{content}</div>
    );
  }
}
