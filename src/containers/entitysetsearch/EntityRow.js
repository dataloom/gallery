import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Table, Column, Cell } from 'fixed-data-table';
import { SearchApi } from 'loom-data';
import PropertyTextCell from './PropertyTextCell';
import RowNeighbors from './RowNeighbors';
import styles from './styles.module.css';

const TABLE_WIDTH = 1000;
const ROW_HEIGHT = 50;
const TABLE_OFFSET = 2;
const PROPERTY_COLUMN_WIDTH = 200;
const COLUMN_WIDTH = (TABLE_WIDTH - PROPERTY_COLUMN_WIDTH);
const HEADERS = ['Property', 'Data'];

export default class EntityRow extends React.Component {
  static propTypes = {
    row: PropTypes.object.isRequired,
    entitySetId: PropTypes.string.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    backFn: PropTypes.func,
    formatValueFn: PropTypes.func,
    entityId: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    jumpFn: PropTypes.func,
    breadcrumbs: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.state = {
      propertyIds: Object.keys(props.row),
      neighbors: []
    };
  }

  componentDidMount() {
    this.loadNeighbors(this.props.entityId, this.props.entitySetId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entityId !== this.props.entityId) {
      this.setState({
        propertyIds: Object.keys(nextProps.row),
        neighbors: []
      });
      this.loadNeighbors(nextProps.entityId, nextProps.entitySetId);
    }
  }

  loadNeighbors = (entityId, entitySetId) => {
    SearchApi.searchEntityNeighbors(entitySetId, entityId).then((neighbors) => {
      this.setState({ neighbors });
    });
  }

  renderTable = () => {
    const tableHeight = ((this.state.propertyIds.length + 1) * ROW_HEIGHT) + TABLE_OFFSET;
    return (
      <Table
          rowsCount={this.state.propertyIds.length}
          rowHeight={ROW_HEIGHT}
          headerHeight={ROW_HEIGHT}
          width={TABLE_WIDTH}
          height={tableHeight}>
        {this.renderPropertyColumn()}
        {this.renderDataColumn()}
      </Table>
    );
  }

  renderPropertyColumn() {
    const header = HEADERS[0];
    const propertyTitles = this.getPropertyTitles();

    return (
      <Column
          key={0}
          header={header}
          cell={
            <PropertyTextCell data={propertyTitles} />
          }
          width={PROPERTY_COLUMN_WIDTH} />
    );
  }

  renderDataColumn() {
    const header = HEADERS[1];
    const cellData = this.getCellData();

    return (
      <Column
          key={1}
          header={<Cell>{header}</Cell>}
          cell={
            <PropertyTextCell data={cellData} />
          }
          width={COLUMN_WIDTH} />
    );
  }

  getPropertyTitles() {
    const { propertyTypes } = this.props;
    const { propertyIds } = this.state;
    const headers = propertyIds.map((id) => {
      const property = propertyTypes.filter((propertyType) => {
        const fqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
        return (propertyType.id === id || fqn === id);
      });

      return property[0].title;
    });

    return headers;
  }

  getCellData() {
    const { row } = this.props;
    const { propertyIds } = this.state;

    return propertyIds.map((id) => {
      const formatValue = this.props.formatValueFn([row][0][id]);
      return formatValue;
    });
  }

  renderBackButton = () => {
    if (!this.props.backFn) return null;
    return (
      <div>
        <Button onClick={this.props.backFn} bsStyle="primary" className={styles.backButton}>Back to results</Button>
        <br />
      </div>
    );
  }

  renderNeighbors = () => {
    return (
      <RowNeighbors
          neighbors={this.state.neighbors}
          onClick={this.props.onClick}
          formatValueFn={this.props.formatValueFn} />
    );
  }

  renderBreadcrumbs = () => {
    const breadcrumbs = [];
    breadcrumbs.push(<span className={styles.crumbLink} onClick={this.props.backFn}>Results</span>);
    for (let i = 0; i < this.props.breadcrumbs.length; i += 1) {
      const crumb = this.props.breadcrumbs[i];
      breadcrumbs.push(<span className={styles.crumbDivider}> / </span>);
      breadcrumbs.push(
        <span
            className={styles.crumbLink}
            onClick={() => {
              this.props.jumpFn(i);
            }}>
          {crumb.title}
        </span>
      );
    }
    return (<div className={styles.breadcrumbsContainer}>{breadcrumbs}</div>);
  }

  render() {
    return (
      <div>
        {this.renderBreadcrumbs()}
        {this.renderTable()}
        {this.renderNeighbors()}
      </div>
    );
  }
}
