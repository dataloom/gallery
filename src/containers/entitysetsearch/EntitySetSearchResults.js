import React, { PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import TextCell from './TextCell';
import styles from './styles.module.css';

const TABLE_WIDTH = 1000;
const TABLE_HEIGHT = 500;
const ROW_HEIGHT = 50;

export default class EntitySetSearchResults extends React.Component {
  static propTypes = {
    results: PropTypes.array,
    propertyTypes: PropTypes.array
  }

  renderColumns = () => {
    const columnWidth = TABLE_WIDTH / Object.keys(this.props.results[0]).length;
    const propertyIds = Object.keys(this.props.results[0]);
    return propertyIds.map((id) => {
      const title = this.props.propertyTypes.filter((propertyType) => {
        return propertyType.id === id;
      })[0].title;
      return (
        <Column
            key={id}
            header={<Cell>{title}</Cell>}
            cell={
              <TextCell results={this.props.results} field={id} />
            }
            width={columnWidth} />
      );
    });
  }

  renderResults = () => {
    return (
      <Table
          rowsCount={this.props.results.length}
          rowHeight={ROW_HEIGHT}
          headerHeight={ROW_HEIGHT}
          width={TABLE_WIDTH}
          height={TABLE_HEIGHT}>
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
    const content = (this.props.results.length < 1) ? this.renderNoResults() : this.renderResults();
    return (
      <div>{content}</div>
    );
  }

}
