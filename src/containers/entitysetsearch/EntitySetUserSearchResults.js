import React, { PropTypes } from 'react';
import UserRow from './UserRow';
import EntityRow from './EntityRow';

export default class EntitySetUserSearchResults extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    entitySetId: PropTypes.string.isRequired,
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
      selectedId: undefined,
      selectedRow: undefined,
      selectedEntitySetId: undefined,
      selectedPropertyTypes: undefined
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      results: nextProps.results
    });
  }

  onUserSelect = (selectedId, selectedRow, selectedEntitySetId, selectedPropertyTypes) => {
    this.setState({ selectedId, selectedRow, selectedEntitySetId, selectedPropertyTypes });
    this.props.hidePaginationFn(true);
  }

  onUserDeselect = () => {
    this.setState({
      selectedId: undefined,
      selectedRow: undefined,
      selectedEntitySetId: undefined,
      selectedPropertyTypes: undefined
    });
    this.props.hidePaginationFn(false);
  }

  renderAllUserResults = () => {
    const firstNameId = this.props.firstName.id;
    const lastNameId = this.props.lastName.id;
    const resultRows = [];
    this.state.results.forEach((row) => {
      const propertyTypeIds = Object.keys(row).filter((id) => {
        return (id !== 'id');
      });
      if (propertyTypeIds.includes(firstNameId) && propertyTypeIds.includes(lastNameId)) {
        resultRows.push(
          <UserRow
              key={row.id}
              row={row}
              entitySetId={this.props.entitySetId}
              propertyTypes={this.props.propertyTypes}
              firstName={this.props.firstName}
              lastName={this.props.lastName}
              dob={this.props.dob}
              selectUserFn={this.onUserSelect}
              formatValueFn={this.props.formatValueFn}
              entityId={row.id} />
        );
      }
    });
    return resultRows;
  }

  renderSingleUser = () => {
    const row = Object.assign({}, this.state.selectedRow);
    delete row.id;
    return (
      <UserRow
          row={row}
          entityId={this.state.selectedRow.id}
          entitySetId={this.state.selectedEntitySetId}
          propertyTypes={this.state.selectedPropertyTypes}
          firstName={this.props.firstName}
          lastName={this.props.lastName}
          dob={this.props.dob}
          backFn={this.onUserDeselect}
          userPage
          formatValueFn={this.props.formatValueFn}
          onClick={this.onUserSelect} />
    );
  }

  renderSingleRow = () => {
    const row = Object.assign({}, this.state.selectedRow);
    delete row.id;
    return (
      <EntityRow
          row={row}
          entityId={this.state.selectedRow.id}
          entitySetId={this.state.selectedEntitySetId}
          propertyTypes={this.state.selectedPropertyTypes}
          backFn={this.onUserDeselect}
          formatValueFn={this.props.formatValueFn}
          onClick={this.onUserSelect} />);
  }

  renderResults = () => {
    if (this.state.selectedRow) {
      return (this.state.selectedEntitySetId === this.props.entitySetId) ?
        this.renderSingleUser() : this.renderSingleRow();
    }
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
