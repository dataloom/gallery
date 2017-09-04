/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { EntityDataModelApi, Models } from 'lattice';
import { Grid, ScrollSync } from 'react-virtualized';

import EntityRow from './EntityRow';
import TextCell from './TextCell';
import getTitle from '../../utils/EntityTypeTitles';
import styles from './styles.module.css';

const COLUMN_MIN_WIDTH = 100;
const COLUMN_MAX_WIDTH = 500;
const ROW_MIN_HEIGHT = 50;
const GRID_MAX_HEIGHT = 600;
const GRID_MAX_WIDTH = 980; // from page.module.css .content{}

const {
  FullyQualifiedName
} = Models;

const TableContainer = styled.div`
  border: 1px solid #eeeeee;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  overflow: hidden;
`;

const TableHeadContainer = styled.div`
  background-color: #f8f8f8;
  border-bottom: 1px solid #eeeeee;
  color: #424242;
  display: flex;
  height: ${ROW_MIN_HEIGHT}px;
  width: ${GRID_MAX_WIDTH}px;
`;

const TableBodyContainer = styled.div`
  color: #424242;
  display: flex;
  height: ${(props :Object) => {
    const height = props.gridHeight ? props.gridHeight : GRID_MAX_HEIGHT;
    // -1 to compensate for the border-bottom of each cell
    return `${height - 1}px`;
  }};
  width: ${GRID_MAX_WIDTH}px;
`;

const TableHeadGrid = styled(Grid)`
  outline: none;
  overflow: hidden !important;
`;

const TableBodyGrid = styled(Grid)`
  cursor: pointer;
  outline: none;
`;

const TableHeadCell = styled.div`
  align-items: center;
  display: flex;
  font-weight: bold;
  padding: 10px;
  max-width: 500px;
`;

const TableBodyCell = styled.div`
  align-items: center;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  padding: 10px;
  max-width: 500px;
  ${(props :Object) => {
    if (props.highlight) {
      return css`
        background-color: #f8f8f8;
      `;
    }
    return '';
  }}
`;

export default class EntitySetSearchResults extends React.Component {

  static propTypes = {
    results: PropTypes.array.isRequired,
    entitySetId: PropTypes.string.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    formatValueFn: PropTypes.func.isRequired,
    showCount: PropTypes.bool
  }

  state :{
    columnHeaders :List<string>,
    columnHeaderToWidthMap :Map<string, number>,
    hoveredColumnIndex :number,
    hoveredRowIndex :number,
    results :Object[]
  }

  tableHeadGrid :Grid;
  tableBodyGrid :Grid;

  constructor(props :Object) {

    super(props);

    const columnHeaders = this.getColumnHeaders(props.propertyTypes);
    const columnHeaderToWidthMap = this.getColumnHeaderToWidthMap(columnHeaders, props.results);

    this.state = {
      columnHeaders,
      columnHeaderToWidthMap,
      hoveredColumnIndex: -1,
      hoveredRowIndex: -1,
      results: props.results,
      selectedId: undefined,
      selectedRow: undefined,
      selectedEntitySet: undefined,
      selectedPropertyTypes: undefined,
      breadcrumbs: []
    };
  }

  componentWillReceiveProps(nextProps :Object) {

    const propertyTypes = nextProps.propertyTypes;
    const results = nextProps.results;
    const columnHeaders = this.getColumnHeaders(propertyTypes);
    const columnHeaderToWidthMap = this.getColumnHeaderToWidthMap(columnHeaders, results);

    this.setState({
      columnHeaders,
      columnHeaderToWidthMap,
      results
    });
  }

  componentWillUpdate(nextProps :Object, nextState :Object) {

    if (!this.state.columnHeaderToWidthMap.equals(nextState.columnHeaderToWidthMap)) {
      // https://github.com/bvaughn/react-virtualized/issues/136#issuecomment-190440226
      this.tableHeadGrid.recomputeGridSize();
      this.tableBodyGrid.recomputeGridSize();
    }
  }

  getColumnHeaders = (propertyTypes :Object[]) => {

    return Immutable.List().withMutations((list :List<string>) => {
      propertyTypes.forEach((propertyType :Object) => {
        const fqn :FullyQualifiedName = new FullyQualifiedName(propertyType.type);
        list.push(fqn.getFullyQualifiedName());
      });
    });
  }

  getColumnHeaderToWidthMap = (columnHeaders :List<string>, results :Object[]) => {

    return Immutable.Map().withMutations((map :Map<string, number>) => {

      // iterate through the results, column by column, and compute an estimated width for each column
      columnHeaders.forEach((header :string) => {

        // find the widest cell in the column
        let columnWidth :number = 0;
        let isColumnEmpty :boolean = true;

        results.forEach((row) => {
          const cell = row[header];
          if (cell) {
            const cellValue = cell[0]; // TODO: how do we handle when this has more than 1 elements?
            if (cellValue) {
              isColumnEmpty = false;
              const cellWidth = `${cellValue}`.length;
              if (cellWidth > columnWidth) {
                columnWidth = cellWidth;
              }
            }
          }
        });

        // compare the header cell width with the widest cell in the table
        const headerCellWidth = `${header}`.length;
        const newColumnWidth = (headerCellWidth > columnWidth) ? headerCellWidth : columnWidth;

        // assume 10px per character. not the best approach, but an ok aproximation for now.
        let columnWidthInPixels = newColumnWidth * 10;

        // ensure column will have a minimum width
        if (columnWidthInPixels < COLUMN_MIN_WIDTH) {
          columnWidthInPixels = COLUMN_MIN_WIDTH;
        }
        // ensure column will have a maximum width
        else if (columnWidthInPixels > COLUMN_MAX_WIDTH) {
          columnWidthInPixels = COLUMN_MAX_WIDTH;
        }

        // store the computed column width. empty columns will not be rendered
        if (isColumnEmpty) {
          columnWidthInPixels = 0; // indicates an empty column
        }
        map.set(header, columnWidthInPixels);
      });
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
      selectedPropertyTypes: undefined,
      breadcrumbs: []
    });
  }

  renderTextCell = (field :string, rowIndex :number) => {
    return (
      <TextCell
          results={this.state.results}
          field={field}
          formatValueFn={this.props.formatValueFn}
          onClick={this.onRowSelect}
          entitySetId={this.props.entitySetId}
          propertyTypes={this.props.propertyTypes}
          rowIndex={rowIndex} />
    );
  }

  columnIsEmpty = (fqn) => {
    let empty = true;
    this.state.results.forEach((row) => {
      if (row[fqn] && row[fqn].length) empty = false;
    });
    return empty;
  }

  getColumnNamesToShow = () => {
    const columnNamesToShow = new Set();
    this.props.propertyTypes.forEach((propertyType) => {
      const fqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
      if (!this.columnIsEmpty(fqn)) columnNamesToShow.add(fqn);
    });
    return columnNamesToShow;
  }

  renderColumns = () => {
    const columnNamesToShow = this.getColumnNamesToShow();
    const columnWidth = 120;
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
      const fqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
      if (columnNamesToShow.has(fqn)) {
        if (propertyType.type.name !== 'mugshot'
          && propertyType.type.name !== 'scars'
          && propertyType.type.name !== 'tattoos') {
          columns.push(
            <Column
                key={fqn}
                header={<Cell>{propertyType.title}</Cell>}
                cell={this.renderTextCell(fqn, columnWidth)}
                width={columnWidth} />
          );
        }
      }
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

  setTableHeadGrid = (tableHeadGridRef :any) => {

    this.tableHeadGrid = tableHeadGridRef;
  }

  setTableBodyGrid = (tableBodyGridRef :any) => {

    this.tableBodyGrid = tableBodyGridRef;
  }

  isColumnEmpty = (columnIndex :number) => {
    const columnWidth = this.state.columnHeaderToWidthMap.get(this.state.columnHeaders.get(columnIndex));
    return columnWidth === 0;
  }

  getGridColumnWidth = ({ index }) => {
    return this.state.columnHeaderToWidthMap.get(this.state.columnHeaders.get(index));
  };

  getGridRowHeight = ({ index }) => {
    return ROW_MIN_HEIGHT; // TODO: implement more intelligently
  };

  renderGridHeaderCell = ({ columnIndex, key, style }) => {

    if (this.isColumnEmpty(columnIndex)) {
      return null;
    }

    return (
      <TableHeadCell key={key} style={style}>
        {this.state.columnHeaders.get(columnIndex)}
      </TableHeadCell>
    );
  }

  renderGridCell = ({ columnIndex, key, rowIndex, style, parent }) => {

    if (this.isColumnEmpty(columnIndex)) {
      return null;
    }

    const setState = this.setState.bind(this);
    const columnHeader = this.state.columnHeaders.get(columnIndex);

    return (
      <TableBodyCell
          key={key}
          style={style}
          highlight={rowIndex === this.state.hoveredRowIndex}
          onMouseLeave={() => {
            setState({
              hoveredColumnIndex: -1,
              hoveredRowIndex: -1
            });
            parent.forceUpdate();
          }}
          onMouseOver={() => {
            setState({
              hoveredColumnIndex: columnIndex,
              hoveredRowIndex: rowIndex
            });
            parent.forceUpdate();
          }}>
        {/* {this.state.results[rowIndex][this.state.columnHeaders.get(columnIndex)]} */}
        {this.renderTextCell(columnHeader, rowIndex)}
      </TableBodyCell>
    );
  }

  renderGrid = () => {

    const columnCount = this.state.columnHeaders.size;
    const rowCount = this.state.results.length;

    const overscanColumnCount = 4;
    const overscanRowCount = 4;

    // this doesn't seem necessary, but the "height" prop is required :/
    let gridHeight = rowCount * ROW_MIN_HEIGHT;
    if (gridHeight > GRID_MAX_HEIGHT) {
      gridHeight = GRID_MAX_HEIGHT;
    }

    return (
      <ScrollSync>
        {
          ({ onScroll, scrollLeft }) => {
            return (
              <TableContainer>
                <TableHeadContainer>
                  <TableHeadGrid
                      cellRenderer={this.renderGridHeaderCell}
                      columnCount={columnCount}
                      columnWidth={this.getGridColumnWidth}
                      estimatedColumnSize={COLUMN_MIN_WIDTH}
                      height={ROW_MIN_HEIGHT}
                      innerRef={this.setTableHeadGrid}
                      overscanColumnCount={overscanColumnCount}
                      overscanRowCount={overscanRowCount}
                      rowHeight={ROW_MIN_HEIGHT}
                      rowCount={1}
                      scrollLeft={scrollLeft}
                      width={GRID_MAX_WIDTH} />
                </TableHeadContainer>
                <TableBodyContainer gridHeight={gridHeight}>
                  <TableBodyGrid
                      cellRenderer={this.renderGridCell}
                      columnCount={columnCount}
                      columnWidth={this.getGridColumnWidth}
                      estimatedColumnSize={COLUMN_MIN_WIDTH}
                      height={gridHeight}
                      innerRef={this.setTableBodyGrid}
                      onScroll={onScroll}
                      overscanColumnCount={overscanColumnCount}
                      overscanRowCount={overscanRowCount}
                      rowCount={rowCount}
                      rowHeight={this.getGridRowHeight}
                      width={GRID_MAX_WIDTH} />
                </TableBodyContainer>
              </TableContainer>
            );
          }
        }
      </ScrollSync>
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
      content = (this.state.results.length < 1) ? this.renderNoResults() : this.renderGrid();
    }
    return (
      <div>{content}</div>
    );
  }

}
