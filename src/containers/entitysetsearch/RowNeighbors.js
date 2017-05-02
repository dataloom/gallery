import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Table, Column, Cell } from 'fixed-data-table';
import TextCell from './TextCell';
import styles from './styles.module.css';

const NO_NEIGHBOR = 'NO_NEIGHBOR';

const TABLE_WIDTH = 1000;
const ROW_HEIGHT = 50;
const TABLE_OFFSET = 2;

export default class RowNeighbors extends React.Component {

  static propTypes = {
    neighbors: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    formatValueFn: PropTypes.func.isRequired,
    entitySetTitle: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      organizedNeighbors: this.organizeNeighbors(props.neighbors)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.neighbors !== nextProps.neighbors) {
      this.setState({
        organizedNeighbors: this.organizeNeighbors(nextProps.neighbors)
      });
    }
  }

  organizeNeighbors = (neighbors) => {
    const organizedNeighbors = {};
    neighbors.forEach((neighbor) => {
      const associationEntitySetId = neighbor.associationEntitySet.id;
      const neighborEntitySetId = (neighbor.neighborEntitySet) ? neighbor.neighborEntitySet.id : NO_NEIGHBOR;

      if (!organizedNeighbors[associationEntitySetId]) {
        organizedNeighbors[associationEntitySetId] = {
          [neighborEntitySetId]: [neighbor]
        };
      }
      else if (!organizedNeighbors[associationEntitySetId][neighborEntitySetId]) {
        organizedNeighbors[associationEntitySetId][neighborEntitySetId] = [neighbor];
      }
      else {
        organizedNeighbors[associationEntitySetId][neighborEntitySetId].push(neighbor);
      }
    });
    return organizedNeighbors;
  }

  renderColumns = (renderingAssociation, rowValues, neighborGroup, noNeighbor) => {
    const entitySetId = (noNeighbor) ? null : neighborGroup.neighborEntitySet.id;
    let numColumns = neighborGroup.associationPropertyTypes.length;
    if (!noNeighbor) numColumns += neighborGroup.neighborPropertyTypes.length;
    const propertyTypes = (renderingAssociation) ?
      neighborGroup.associationPropertyTypes : neighborGroup.neighborPropertyTypes;

    const columnWidth = (TABLE_WIDTH - 1) / numColumns;
    const allColumns = propertyTypes.map((propertyType) => {
      const field = `${propertyType.type.namespace}.${propertyType.type.name}`;
      return (
        <Column
            key={`${entitySetId}-${propertyType.id}`}
            header={<Cell>{propertyType.title}</Cell>}
            cell={
              <TextCell
                  results={rowValues}
                  field={field}
                  formatValueFn={this.props.formatValueFn}
                  onClick={this.props.onClick}
                  width={columnWidth}
                  entitySetId={entitySetId}
                  propertyTypes={neighborGroup.neighborPropertyTypes} />
            }
            width={columnWidth} />
      );
    });
    return allColumns;
  }


  renderNeighborGroupTitle = (neighbor, neighborId) => {
    const entitySetTitle = this.props.entitySetTitle || '';
    const neighborTitle = (neighborId === NO_NEIGHBOR)
      ? <div className={styles.neighborGroupTitleUnclickable}>?</div>
      : (<Link to={`/entitysets/${neighborId}`} className={styles.neighborGroupTitle}>
        {neighbor.neighborEntitySet.title}
      </Link>);
    return (neighbor.src)
      ? <div className={styles.neighborContainer}>
        {entitySetTitle} {`${neighbor.associationEntitySet.title}`} {neighborTitle}</div>
    : <div className={styles.neighborContainer}>
      {neighborTitle} {`${neighbor.associationEntitySet.title}`} {entitySetTitle}</div>;
  }

  renderNeighborGroup = (neighborGroup, neighborId) => {
    const noNeighbor = neighborId === NO_NEIGHBOR;
    const tableHeight = ((neighborGroup.length + 1) * ROW_HEIGHT) + TABLE_OFFSET;

    const rowValues = neighborGroup.map((neighbor) => {
      const row = (noNeighbor) ? neighbor.associationDetails :
        Object.assign({}, neighbor.associationDetails, neighbor.neighborDetails);
      if (!noNeighbor) row.id = neighbor.neighborId;
      return row;
    });
    const associationColumns = this.renderColumns(true, rowValues, neighborGroup[0], noNeighbor);
    const neighborColumns = (noNeighbor) ? null :
      this.renderColumns(false, rowValues, neighborGroup[0], noNeighbor);

    return (
      <div key={neighborId}>
        {this.renderNeighborGroupTitle(neighborGroup[0], neighborId)}
        <Table
            rowsCount={neighborGroup.length}
            rowHeight={ROW_HEIGHT}
            headerHeight={ROW_HEIGHT}
            width={TABLE_WIDTH}
            height={tableHeight}>
          {associationColumns}
          {neighborColumns}
        </Table>
      </div>
    );
  }

  renderAssociationGroup = (associationGroup) => {
    const neighborGroups = Object.keys(associationGroup).map((neighborId) => {
      const neighborGroup = associationGroup[neighborId];
      return this.renderNeighborGroup(neighborGroup, neighborId);
    });
    const title = Object.values(associationGroup)[0][0].associationEntitySet.title;
    return (
      <div>
        <div className={styles.spacerSmall} />
        <hr />
        <div className={styles.spacerSmall} />
        <div className={styles.associationGroupTitle}>{title}</div>
        {neighborGroups}
      </div>
    );
  }

  renderNeighbors = () => {
    const neighbors = Object.keys(this.state.organizedNeighbors).map((associationId) => {
      const associationGroup = this.state.organizedNeighbors[associationId];
      return (
        <div key={associationId}>
          {this.renderAssociationGroup(associationGroup)}
        </div>
      );
    });
    return neighbors;
  }

  render() {
    return (
      <div>
        {this.renderNeighbors()}
      </div>
    );
  }

}
