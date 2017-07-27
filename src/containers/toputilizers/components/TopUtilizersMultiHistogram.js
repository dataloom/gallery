import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { HistogramVisualization } from '../../visualizations/HistogramVisualization';
import styles from '../styles.module.css';

const COUNT_FIELD = 'count';

export default class TopUtilizersHistogram extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    entityType: PropTypes.object.isRequired,
    allEntityTypes: PropTypes.object.isRequired,
    allPropertyTypes: PropTypes.object.isRequired,
    neighbors: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      histogramData: this.getAllHistogramData(
        props.entityType,
        props.allEntityTypes,
        props.allPropertyTypes,
        props.neighbors)
    };
  }

  componentWillReceiveProps(nextProps) {
    const { entityType, allEntityTypes, allPropertyTypes, neighbors } = nextProps;
    if (neighbors.size !== this.props.neighbors.size) {
      this.setState({
        histogramData: this.getAllHistogramData(entityType, allEntityTypes, allPropertyTypes, neighbors)
      });
    }
  }

  getFqnToPropertyType = (allPropertyTypes) => {
    const fqnToPropertyType = {};
    Object.values(allPropertyTypes).forEach((propertyType) => {
      const fqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
      fqnToPropertyType[fqn] = propertyType;
    });
    return fqnToPropertyType;
  }

  getFormattedHistogramData = (histogramCounts, allPropertyTypes) => {
    const histogramData = {};
    const fqnToPropertyType = this.getFqnToPropertyType(allPropertyTypes);
    Object.entries(histogramCounts).forEach((entityTypeEntry) => {
      const entityTypeId = entityTypeEntry[0];
      Object.entries(entityTypeEntry[1]).forEach((propertyTypeEntry) => {
        const histogramValuesList = [];
        const propertyTypeId = fqnToPropertyType[propertyTypeEntry[0]].id;
        const histogramId = this.getHistogramId(entityTypeId, propertyTypeId);
        Object.entries(propertyTypeEntry[1]).forEach((barEntry) => {
          histogramValuesList.push({
            name: barEntry[0],
            count: barEntry[1]
          });
        });
        histogramData[histogramId] = histogramValuesList;
      });
    });
    return histogramData;
  }

  getAllHistogramData = (utilizerEntityType, allEntityTypes, allPropertyTypes, neighbors) => {
    const histogramCounts = {};

    Object.values(allEntityTypes).forEach((entityType) => {
      histogramCounts[entityType.id] = {};
      entityType.properties.forEach((propertyId) => {
        const fqn = `${allPropertyTypes[propertyId].type.namespace}.${allPropertyTypes[propertyId].type.name}`;
        histogramCounts[entityType.id][fqn] = {};
      });
    });

    this.props.results.forEach((utilizer) => {
      const entityId = utilizer.id[0];
      Object.entries(utilizer).forEach((entry) => {
        const propertyTypeFqn = entry[0];
        if (propertyTypeFqn !== 'count' && propertyTypeFqn !== 'id') {
          entry[1].forEach((value) => {
            const prevCount = histogramCounts[utilizerEntityType.id][propertyTypeFqn][value] || 0;
            histogramCounts[utilizerEntityType.id][propertyTypeFqn][value] = prevCount + 1;
          });
        }
      });
      const utilizerNeighbors = neighbors.get(entityId) || [];
      utilizerNeighbors.forEach((neighbor) => {
        if (neighbor.has('neighborEntitySet') && neighbor.has('neighborDetails')) {
          const entityTypeId = neighbor.getIn(['neighborEntitySet', 'entityTypeId']);
          neighbor.get('neighborDetails').entrySeq().forEach((entry) => {
            const propertyTypeFqn = entry[0];
            entry[1].forEach((value) => {
              const prevCount = histogramCounts[entityTypeId][propertyTypeFqn][value] || 0;
              histogramCounts[entityTypeId][propertyTypeFqn][value] = prevCount + 1;
            });
          });
        }
      });

    });

    return this.getFormattedHistogramData(histogramCounts, allPropertyTypes);
  }

  getHistogramId = (entityTypeId, propertyTypeId) => {
    return `${entityTypeId}|${propertyTypeId}`;
  }

  getTypesFromId = (histogramId) => {
    const types = histogramId.split('|');
    return {
      entityType: this.props.allEntityTypes[types[0]],
      propertyType: this.props.allPropertyTypes[types[1]]
    };
  }

  renderSingleHistogram = (counts, entityType, propertyType, id) => {
    if (!counts.length) return null;
    const title = `${entityType.title}: ${propertyType.title}`;
    return (
      <div className={styles.wrappingHistogramContainer} key={id}>
        <h2>{title}</h2>
        <HistogramVisualization counts={counts} fields={[COUNT_FIELD]} height={225} width={450} />
      </div>
    );
  }

  renderHistograms = () => {
    return Object.entries(this.state.histogramData).map((entry) => {
      const { entityType, propertyType } = this.getTypesFromId(entry[0]);
      return this.renderSingleHistogram(entry[1], entityType, propertyType, entry[0]);
    });
  }

  render() {
    if (!this.props.entityType) return null;
    return (
      <div className={styles.multiHistogramSection}>
        {this.renderHistograms()}
      </div>
    );
  }
}
