import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import UserRow from './UserRow';
import EntityRow from './EntityRow';
import EntityTypeTitles from '../../utils/EntityTypeTitles';

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
      selectedEntitySet: undefined,
      selectedPropertyTypes: undefined,
      breadcrumbs: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      results: nextProps.results
    });
  }

  onUserSelect = (selectedId, selectedRow, selectedEntitySetId, selectedPropertyTypes) => {
    EntityDataModelApi.getEntitySet(selectedEntitySetId)
    .then((selectedEntitySet) => {
      EntityDataModelApi.getEntityType(selectedEntitySet.entityTypeId)
      .then((entityType) => {
        const crumb = {
          id: selectedId,
          title: EntityTypeTitles.getTitle(entityType, selectedRow, selectedPropertyTypes),
          row: selectedRow,
          propertyTypes: selectedPropertyTypes,
          entitySet: selectedEntitySet
        };
        const breadcrumbs = this.state.breadcrumbs.concat(crumb);
        this.setState({ selectedId, selectedRow, selectedEntitySet, selectedPropertyTypes, breadcrumbs });
        this.props.hidePaginationFn(true);
      });
    });
  }

  jumpToRow = (index) => {
    const crumb = this.state.breadcrumbs[index];
    const breadcrumbs = this.state.breadcrumbs.slice(0, index + 1);
    this.setState({
      selectedId: crumb.id,
      selectedRow: crumb.row,
      selectedEntitySet: crumb.entitySet,
      selectedPropertyTypes: crumb.propertyTypes,
      breadcrumbs
    });
  }

  onUserDeselect = () => {
    this.setState({
      selectedId: undefined,
      selectedRow: undefined,
      selectedEntitySet: undefined,
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
          entityId={this.state.selectedId}
          entitySet={this.state.selectedEntitySet}
          propertyTypes={this.state.selectedPropertyTypes}
          firstName={this.props.firstName}
          lastName={this.props.lastName}
          dob={this.props.dob}
          backFn={this.onUserDeselect}
          userPage
          formatValueFn={this.props.formatValueFn}
          onClick={this.onUserSelect}
          jumpFn={this.jumpToRow}
          breadcrumbs={this.state.breadcrumbs} />
    );
  }

  renderSingleRow = () => {
    const row = Object.assign({}, this.state.selectedRow);
    delete row.id;
    return (
      <EntityRow
          row={row}
          entityId={this.state.selectedId}
          entitySet={this.state.selectedEntitySet}
          propertyTypes={this.state.selectedPropertyTypes}
          backFn={this.onUserDeselect}
          formatValueFn={this.props.formatValueFn}
          onClick={this.onUserSelect}
          jumpFn={this.jumpToRow}
          breadcrumbs={this.state.breadcrumbs} />);
  }

  renderResults = () => {
    if (this.state.selectedRow) {
      return (this.state.selectedEntitySet.id === this.props.entitySetId) ?
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
