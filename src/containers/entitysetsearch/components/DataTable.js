/*
 * @flow
 */

import * as React from 'react';

import Immutable from 'immutable';
import styled, { css } from 'styled-components';
import { Grid, ScrollSync } from 'react-virtualized';

/*
 * constants
 */

const TABLE_MAX_HEIGHT = 600;
const TABLE_MAX_WIDTH = 980; // from page.module.css .content{}

const COLUMN_MAX_WIDTH = 400;
const COLUMN_MIN_WIDTH = 100;

// TODO: what about ROW_MAX_HEIGHT?
const ROW_MIN_HEIGHT = 50;

const BORDER_COLOR = '#eeeeee';
const HEAD_BG_COLOR = '#f8f9fa';
const HEAD_COLOR = '#334455';
const CELL_HOV_COLOR = '#f8f8f8';

/*
 * styled components
 */

const TableContainer = styled.div`
  border: 1px solid ${BORDER_COLOR};
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  overflow: hidden;
`;

const TableHeadContainer = styled.div`
  background-color: ${HEAD_BG_COLOR};
  border-bottom: 1px solid ${BORDER_COLOR};
  color: ${HEAD_COLOR};
  display: flex;
  font-weight: bold;
  height: ${ROW_MIN_HEIGHT}px;
  width: ${TABLE_MAX_WIDTH}px;
`;

const TableBodyContainer = styled.div`
  color: #424242;
  display: flex;
  height: ${(props :Object) => {
    const height = props.gridHeight ? props.gridHeight : TABLE_MAX_HEIGHT;
    // -1 to compensate for the border-bottom of each cell
    return `${height - 1}px`;
  }};
  width: ${TABLE_MAX_WIDTH}px;
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
  padding: 10px;
  ${(props :Object) => {
    if (props.setMaxWidth) {
      return css`
        max-width: ${COLUMN_MAX_WIDTH}px;
      `;
    }
    return '';
  }}
`;

const TableBodyCell = styled.div`
  align-items: center;
  border-bottom: 1px solid ${BORDER_COLOR};
  display: flex;
  overflow-y: scroll !important;
  padding: 10px;
  ${(props :Object) => {
    if (props.setMaxWidth) {
      return css`
        max-width: ${COLUMN_MAX_WIDTH}px;
      `;
    }
    return '';
  }}
  ${(props :Object) => {
    if (props.highlight) {
      return css`
        background-color: ${CELL_HOV_COLOR};
      `;
    }
    return '';
  }}
`;

type SetMultiMap = Map<string, Set<any>>;
type ListSetMultiMap = List<SetMultiMap>;

type Props = {
  data :ListSetMultiMap,
  headers :List<Map<string, string>>,
  excludeEmptyColumns :boolean,
  onRowClick :Function
};

type State = {
  headerIdToWidthMap :Map<string, number>,
  hoveredColumnIndex :number,
  hoveredRowIndex :number,
  lastColumnOverrideMaxWidth :boolean
};

// TODO: should the 'data' prop be ListSetMultiMap, or is that too specific to search results data?
// TODO: allow table dimensions to be configurable
// TODO: compute estimated row heights similar to how column widths are computed
class DataTable extends React.Component<Props, State> {

  static defaultProps = {
    excludeEmptyColumns: true,
    onRowClick: () => {}
  };

  tableHeadGrid :?Grid;
  tableBodyGrid :?Grid;

  constructor(props :Props) {

    super(props);

    let headerIdToWidthMap :Map<string, number> = this.getHeaderIdToWidthMap(props.headers, props.data);

    const tableWidth :number = headerIdToWidthMap.reduce(
      (widthSum :number, columnWidth :number) :number => {
        return widthSum + columnWidth;
      },
      0
    );

    const lastColumnOverrideMaxWidth :boolean = (tableWidth < TABLE_MAX_WIDTH);

    if (lastColumnOverrideMaxWidth) {
      const lastHeader :string = headerIdToWidthMap.keySeq().last();
      const lastColumnWidth :number = headerIdToWidthMap.get(lastHeader);
      const differenceInWidth :number = TABLE_MAX_WIDTH - tableWidth;
      headerIdToWidthMap = headerIdToWidthMap.set(lastHeader, lastColumnWidth + differenceInWidth);
    }

    this.state = {
      headerIdToWidthMap,
      lastColumnOverrideMaxWidth,
      hoveredColumnIndex: -1,
      hoveredRowIndex: -1
    };
  }

  componentWillReceiveProps(nextProps :Object) {

    // if either the data changed or the headers changed, we need to setState() again
    if (!this.props.data.equals(nextProps.data) || !this.props.headers.equals(nextProps.headers)) {

      let headerIdToWidthMap :Map<string, number> = this.getHeaderIdToWidthMap(nextProps.headers, nextProps.data);

      const tableWidth :number = headerIdToWidthMap.reduce(
        (widthSum :number, columnWidth :number) :number => {
          return widthSum + columnWidth;
        },
        0
      );

      const lastColumnOverrideMaxWidth :boolean = (tableWidth < TABLE_MAX_WIDTH);
      if (lastColumnOverrideMaxWidth) {
        const lastHeader :string = headerIdToWidthMap.keySeq().last();
        const lastColumnWidth :number = headerIdToWidthMap.get(lastHeader);
        const differenceInWidth :number = TABLE_MAX_WIDTH - tableWidth;
        headerIdToWidthMap = headerIdToWidthMap.set(lastHeader, lastColumnWidth + differenceInWidth);
      }

      this.setState({
        headerIdToWidthMap,
        lastColumnOverrideMaxWidth,
        hoveredColumnIndex: -1,
        hoveredRowIndex: -1
      });
    }
  }

  componentWillUpdate(nextProps :Object, nextState :Object) {

    if (!this.state.headerIdToWidthMap.equals(nextState.headerIdToWidthMap)) {
      if (this.tableHeadGrid && this.tableBodyGrid) {
        // https://github.com/bvaughn/react-virtualized/issues/136#issuecomment-190440226
        this.tableHeadGrid.recomputeGridSize();
        this.tableBodyGrid.recomputeGridSize();
      }
    }
  }

  getHeaderIdToWidthMap = (headers :List<Map<string, string>>, data :ListSetMultiMap) :Map<string, number> => {

    return Immutable.OrderedMap().withMutations((map :OrderedMap<string, number>) => {

      // iterate through the results, column by column, and compute an estimated width for each column
      headers.forEach((header :Map<string, string>) => {

        // find the widest cell in the column
        let columnWidth :number = 0;
        let isColumnEmpty :boolean = true;

        data.forEach((row :SetMultiMap) => {
          const cell :Set<any> = row.get(header.get('id'));
          if (cell) {
            let cellValue :string = cell;
            if (Immutable.isIndexed(cell)) {
              cellValue = cell.join(' ; ');
            }
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
        const headerCellWidth :number = `${header.get('value')}`.length;
        const newColumnWidth :number = (headerCellWidth > columnWidth) ? headerCellWidth : columnWidth;

        // assume 10px per character. not the best approach, but an ok aproximation for now.
        let columnWidthInPixels :number = newColumnWidth * 10;

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

        map.set(header.get('id'), columnWidthInPixels);
      });
    });
  }

  setTableHeadGrid = (tableHeadGridRef :any) => {

    this.tableHeadGrid = tableHeadGridRef;
  }

  setTableBodyGrid = (tableBodyGridRef :any) => {

    this.tableBodyGrid = tableBodyGridRef;
  }

  isColumnEmpty = (columnIndex :number) :boolean => {
    const columnWidth = this.state.headerIdToWidthMap.get(
      this.props.headers.getIn([columnIndex, 'id'], ''),
      COLUMN_MIN_WIDTH
    );
    return this.props.excludeEmptyColumns && columnWidth === 0;
  }

  isLastColumn = (columnIndex :number) :boolean => {
    return columnIndex + 1 === this.state.headerIdToWidthMap.size;
  }

  getGridColumnWidth = (params :Object) :number => {
    return this.state.headerIdToWidthMap.get(
      this.props.headers.getIn([params.index, 'id'], ''),
      COLUMN_MIN_WIDTH
    );
  };

  getGridRowHeight = (params :Object) :number => {
    return ROW_MIN_HEIGHT; // TODO: implement more intelligently
  };

  renderGridHeaderCell = (params :Object) => {

    if (this.isColumnEmpty(params.columnIndex)) {
      return null;
    }

    const setMaxWidth = !this.state.lastColumnOverrideMaxWidth || !this.isLastColumn(params.columnIndex);

    return (
      <TableHeadCell
          key={params.key}
          style={params.style}
          setMaxWidth={setMaxWidth}>
        {this.props.headers.getIn([params.columnIndex, 'value'])}
      </TableHeadCell>
    );
  }

  renderGridCell = (params :Object) => {

    if (this.isColumnEmpty(params.columnIndex)) {
      return null;
    }

    const setState = this.setState.bind(this);
    const setMaxWidth = !this.state.lastColumnOverrideMaxWidth || !this.isLastColumn(params.columnIndex);

    const header :string = this.props.headers.getIn([params.columnIndex, 'id'], '');
    let cellValue = this.props.data.getIn([params.rowIndex, header]);
    if (cellValue && Immutable.isIndexed(cellValue)) {
      cellValue = cellValue.join(' ; ');
    }

    return (
      <TableBodyCell
          key={params.key}
          style={params.style}
          highlight={params.rowIndex === this.state.hoveredRowIndex}
          setMaxWidth={setMaxWidth}
          onClick={() => {
            this.props.onRowClick(params.rowIndex, this.props.data.get(params.rowIndex));
          }}
          onMouseLeave={() => {
            setState({
              hoveredColumnIndex: -1,
              hoveredRowIndex: -1
            });
            params.parent.forceUpdate();
          }}
          onMouseOver={() => {
            setState({
              hoveredColumnIndex: params.columnIndex,
              hoveredRowIndex: params.rowIndex
            });
            params.parent.forceUpdate();
          }}>
        {
          cellValue
        }
      </TableBodyCell>
    );
  }

  render() {

    const columnCount :number = this.props.headers.size;
    const rowCount :number = this.props.data.size;

    if (rowCount === 0) {
      return (
        <div>No data given.</div>
      );
    }

    const overscanColumnCount :number = 4;
    const overscanRowCount :number = 4;

    // this doesn't seem necessary, but the "height" prop is required :/
    let gridHeight :number = rowCount * ROW_MIN_HEIGHT;
    if (gridHeight > TABLE_MAX_HEIGHT) {
      gridHeight = TABLE_MAX_HEIGHT;
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
                      width={TABLE_MAX_WIDTH} />
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
                      width={TABLE_MAX_WIDTH} />
                </TableBodyContainer>
              </TableContainer>
            );
          }
        }
      </ScrollSync>
    );
  }
}

export default DataTable;
