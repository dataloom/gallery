import React, { PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import EntityRow from './EntityRow';
import TextCell from './TextCell';

const TABLE_WIDTH = 1000;
const MAX_TABLE_HEIGHT = 500;
const ROW_HEIGHT = 50;
const TABLE_OFFSET = 2;

export default class EntitySetSearchResults extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    entitySetId: PropTypes.string.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    formatValueFn: PropTypes.func.isRequired
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

  onRowSelect = (selectedId, selectedRow, selectedEntitySetId, selectedPropertyTypes) => {
    this.setState({ selectedId, selectedRow, selectedEntitySetId, selectedPropertyTypes });
  }

  onRowDeselect = () => {
    this.setState({
      selectedId: undefined,
      selectedRow: undefined,
      selectedEntitySetId: undefined,
      selectedPropertyTypes: undefined
    });
  }

  renderColumns = () => {
    const columnWidth = (TABLE_WIDTH - 1) / this.props.propertyTypes.length;
    return this.props.propertyTypes.map((propertyType) => {
      return (
        <Column
            key={propertyType.id}
            header={<Cell>{propertyType.title}</Cell>}
            cell={
              <TextCell
                  results={this.state.results}
                  field={propertyType.id}
                  formatValueFn={this.props.formatValueFn}
                  onClick={this.onRowSelect}
                  width={columnWidth}
                  entitySetId={this.props.entitySetId}
                  propertyTypes={this.props.propertyTypes} />
            }
            width={columnWidth} />
      );
    });
  }

  renderSingleRow = () => {
    const row = Object.assign({}, this.state.selectedRow);
    delete row.id;
    return (
      <EntityRow
          row={row}
          entityId={this.state.selectedId}
          entitySetId={this.state.selectedEntitySetId}
          backFn={this.onRowDeselect}
          formatValueFn={this.props.formatValueFn}
          propertyTypes={this.state.selectedPropertyTypes}
          onClick={this.onRowSelect} />
    )
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
      content = this.renderSingleRow()
    }
    else {
      content = (this.state.results.length < 1) ? this.renderNoResults() : this.renderResults();
    }
    return (
      <div>{content}</div>
    );
  }

}
