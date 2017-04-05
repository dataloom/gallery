import React, { PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import TextCell from './TextCell';

const TABLE_WIDTH = 1000;
const MAX_TABLE_HEIGHT = 500;
const ROW_HEIGHT = 50;
const TABLE_OFFSET = 2;

export default class EntitySetSearchResults extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    formatValueFn: PropTypes.func.isRequired
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

  renderColumns = () => {
    const columnWidth = (TABLE_WIDTH - 1) / this.props.propertyTypes.length;
    return this.props.propertyTypes.map((propertyType) => {
      return (
        <Column
            key={propertyType.id}
            header={<Cell>{propertyType.title}</Cell>}
            cell={
              <TextCell results={this.state.results} field={propertyType.id} formatValueFn={this.props.formatValueFn} />
            }
            width={columnWidth} />
      );
    });
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
    const content = (this.state.results.length < 1) ? this.renderNoResults() : this.renderResults();
    return (
      <div>{content}</div>
    );
  }

}
