import React, { PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import { SearchApi } from 'lattice';

import PropertyTextCell from './PropertyTextCell';
import RowNeighbors from './RowNeighbors';
import RowImage from './components/RowImage';
import styles from './styles.module.css';

const TABLE_WIDTH = 1000;
const ROW_HEIGHT = 60;
const TABLE_OFFSET = 2;
const PROPERTY_COLUMN_WIDTH = 200;
const COLUMN_WIDTH = (TABLE_WIDTH - PROPERTY_COLUMN_WIDTH);
const HEADERS = ['Property', 'Data'];

export default class EntityRow extends React.Component {
  static propTypes = {
    row: PropTypes.object.isRequired,
    entitySet: PropTypes.object.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    propertyTypesByFqn: PropTypes.object.isRequired,
    entitySetPropertyMetadata: PropTypes.object.isRequired,
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
      propertyFqns: Object.keys(props.row),
      neighbors: []
    };
  }

  componentDidMount() {
    this.loadNeighbors(this.props.entityId, this.props.entitySet.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entityId !== this.props.entityId) {
      this.setState({
        propertyFqns: Object.keys(nextProps.row),
        neighbors: []
      });
      this.loadNeighbors(nextProps.entityId, nextProps.entitySet.id);
    }
  }

  loadNeighbors = (entityId, entitySetId) => {
    SearchApi.searchEntityNeighbors(entitySetId, entityId).then((neighbors) => {
      this.setState({ neighbors });
    });
  }

  renderEntitySetTitle = () => {
    if (!this.props.entitySet) return null;
    return (
      <div style={{ fontWeight: 'bold', fontSize: '16px', margin: '10px 0' }}>
        {this.props.entitySet.title}
      </div>
    );
  }

  renderTable = () => {
    const tableHeight = ((this.state.propertyFqns.length + 1) * ROW_HEIGHT) + TABLE_OFFSET;
    return (
      <Table
          rowsCount={this.state.propertyFqns.length}
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
    const { propertyFqns } = this.state;
    const headers = propertyFqns.map((headerFqn) => {
      const property = propertyTypes.filter((propertyType) => {
        const propertyFqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
        return propertyFqn === headerFqn;
      });
      if (property.length === 0) return '';

      return (this.props.entitySetPropertyMetadata[property[0].id]) ?
        this.props.entitySetPropertyMetadata[property[0].id].title : property[0].title;

    });

    return headers;
  }

  getImgCellData(propertyFqn) {
    let counter = 0;
    const images = this.props.row[propertyFqn].map((imgSrc) => {
      counter += 1;
      const key = `${propertyFqn}-${counter}`;
      return <RowImage key={key} tooltipId={key} imgSrc={imgSrc} />;
    });
    return <div className={styles.imgDataContainer}>{images}</div>;
  }

  getTextCellData(propertyFqn) {
    return this.props.formatValueFn(this.props.row[propertyFqn]);
  }

  getCellData() {
    return this.state.propertyFqns.map((fqn) => {
      const propertyNames = this.props.propertyTypes.filter((propertyType) => {
        return (fqn === `${propertyType.type.namespace}.${propertyType.type.name}`);
      });
      if (!propertyNames.length) return this.getTextCellData(fqn);
      const propertyName = propertyNames[0].type.name;
      const cell = (propertyName === 'mugshot' || propertyName === 'scars' || propertyName === 'tattoos')
        ? this.getImgCellData(fqn) : this.getTextCellData(fqn);
      return <div key={fqn}>{cell}</div>;
    });
  }

  renderNeighbors = () => {
    if (this.state.neighbors.length === 0) return null;
    return (
      <RowNeighbors
          propertyTypesByFqn={this.props.propertyTypesByFqn}
          neighbors={this.state.neighbors}
          onClick={this.props.onClick}
          formatValueFn={this.props.formatValueFn}
          entitySetTitle={this.props.entitySet.title} />
    );
  }

  renderBreadcrumbs = () => {
    const breadcrumbs = [];
    breadcrumbs.push(<span key="title" className={styles.crumbLink} onClick={this.props.backFn}>Results</span>);
    for (let i = 0; i < this.props.breadcrumbs.length; i += 1) {
      const crumb = this.props.breadcrumbs[i];
      breadcrumbs.push(<span key={`divider-${i}`} className={styles.crumbDivider}> / </span>);

      if (i + 1 === this.props.breadcrumbs.length) {
        breadcrumbs.push(<span key={`crumb-${i}`} className={styles.crumbActive}>{crumb.title}</span>);
      }
      else {
        breadcrumbs.push(
          <span
              key={`crumb-${i}`}
              className={styles.crumbLink}
              onClick={() => {
                this.props.jumpFn(i);
              }}>
            {crumb.title}
          </span>
        );
      }
    }
    return (<div className={styles.breadcrumbsContainer}>{breadcrumbs}</div>);
  }

  render() {
    return (
      <div>
        {this.renderBreadcrumbs()}
        {this.renderEntitySetTitle()}
        {this.renderTable()}
        {this.renderNeighbors()}
      </div>
    );
  }
}
