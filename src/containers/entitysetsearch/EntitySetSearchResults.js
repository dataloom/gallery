import React, { PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import { EntityDataModelApi } from 'loom-data';
import EntityRow from './EntityRow';
import TextCell from './TextCell';
import getTitle from '../../utils/EntityTypeTitles';
import styles from './styles.module.css';

const TABLE_WIDTH = 1000;
const MAX_TABLE_HEIGHT = 500;
const ROW_HEIGHT = 50;
const TABLE_OFFSET = 2;

export default class EntitySetSearchResults extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    entitySetId: PropTypes.string.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    formatValueFn: PropTypes.func.isRequired,
    showCount: PropTypes.boolean
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

  onRowSelect = (selectedId, selectedRow, selectedEntitySetId, selectedPropertyTypes) => {
    EntityDataModelApi.getEntitySet(selectedEntitySetId)
    .then((selectedEntitySet) => {
      EntityDataModelApi.getEntityType(selectedEntitySet.entityTypeId)
      .then((entityType) => {
        if (selectedId !== this.state.selectedId) {
          const crumb = {
            id: selectedId,
            title: getTitle(entityType, selectedRow, selectedPropertyTypes),
            row: selectedRow,
            propertyTypes: selectedPropertyTypes,
            entitySet: selectedEntitySet
          };
          const breadcrumbs = this.state.breadcrumbs.concat(crumb);
          this.setState({ selectedId, selectedRow, selectedEntitySet, selectedPropertyTypes, breadcrumbs });
        }
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

  onRowDeselect = () => {
    this.setState({
      selectedId: undefined,
      selectedRow: undefined,
      selectedEntitySet: undefined,
      selectedPropertyTypes: undefined
    });
  }

  renderTextCell = (field, columnWidth) => {
    return (
      <TextCell
          results={this.state.results}
          field={field}
          formatValueFn={this.props.formatValueFn}
          onClick={this.onRowSelect}
          width={columnWidth}
          entitySetId={this.props.entitySetId}
          propertyTypes={this.props.propertyTypes} />
    );
  }

  renderColumns = () => {
    const numColumns = (this.props.showCount) ? this.props.propertyTypes.length + 1 : this.props.propertyTypes.length;
    const columnWidth = (TABLE_WIDTH - 1) / numColumns;
    const columns = [];
    if (this.props.showCount) {
      columns.push(
        <Column
            key="count"
            header={<Cell className={styles.countHeaderCell}>Count</Cell>}
            cell={this.renderTextCell('count', columnWidth)}
            width={columnWidth} />
      );
    }
    this.props.propertyTypes.forEach((propertyType) => {
      const key = (Object.keys(this.state.results[0])[0].indexOf('.') > -1)
        ? `${propertyType.type.namespace}.${propertyType.type.name}`
        : propertyType.id;
      columns.push(
        <Column
            key={key}
            header={<Cell>{propertyType.title}</Cell>}
            cell={this.renderTextCell(key, columnWidth)}
            width={columnWidth} />
      );
    });
    return columns;
  }

  renderSingleRow = () => {
    const row = Object.assign({}, this.state.selectedRow);
    delete row.id;
    return (
      <EntityRow
          row={row}
          entityId={this.state.selectedId}
          entitySet={this.state.selectedEntitySet}
          backFn={this.onRowDeselect}
          formatValueFn={this.props.formatValueFn}
          propertyTypes={this.state.selectedPropertyTypes}
          onClick={this.onRowSelect}
          jumpFn={this.jumpToRow}
          breadcrumbs={this.state.breadcrumbs} />
    );
  }

  renderResults = () => {
    const tableHeight = Math.min(((this.state.results.length + 1) * ROW_HEIGHT) + TABLE_OFFSET, MAX_TABLE_HEIGHT);
    return (
      <Table
          rowsCount={this.state.results.length}
          rowHeight={ROW_HEIGHT}
          headerHeight={ROW_HEIGHT}
          width={TABLE_WIDTH}
          height={tableHeight}>
        {this.renderColumns()}
      </Table>
    );
  }

  renderNoResults = () => {
    return (
      <div>There are no results to display.</div>
    );
  }

  render() {
    let content;
    if (this.state.selectedId) {
      content = this.renderSingleRow();
    }
    else {
      content = (this.state.results.length < 1) ? this.renderNoResults() : this.renderResults();
    }
    return (
      <div>{content}</div>
    );
  }

}
