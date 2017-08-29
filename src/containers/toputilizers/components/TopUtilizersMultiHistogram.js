import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { HistogramVisualization } from '../../visualizations/HistogramVisualization';
import styles from '../styles.module.css';

const COUNT_FIELD = 'count';

export default class TopUtilizersMultiHistogram extends React.Component {
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
      utilizerIdToCounts: {},
      valuesToUtilizerIds: {},
      filters: {},
      histogramData: {}
    };
  }

  componentDidMount() {
    const { entityType, allEntityTypes, allPropertyTypes, results, neighbors } = this.props;
    this.getCountsAndValues(entityType, allEntityTypes, allPropertyTypes, results, neighbors);
  }

  componentWillReceiveProps(nextProps) {
    const { entityType, allEntityTypes, allPropertyTypes, results, neighbors } = nextProps;
    if (neighbors.size !== this.props.neighbors.size) {
      this.getCountsAndValues(entityType, allEntityTypes, allPropertyTypes, results, neighbors);
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

  getFormattedHistogramData = (histogramCounts) => {
    const histogramData = {};
    Object.entries(histogramCounts).forEach((entityTypeEntry) => {
      const entityTypeId = entityTypeEntry[0];
      Object.entries(entityTypeEntry[1]).forEach((propertyTypeEntry) => {
        const histogramValuesList = [];
        const propertyTypeId = propertyTypeEntry[0];
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

  filteredValuesPresent = (valuesFiltered, valuesPresent) => {
    let filteredValuesPresent = true;
    valuesFiltered.forEach((valueFilter) => {
      if (!valuesPresent.includes(valueFilter)) filteredValuesPresent = false;
    });
    return filteredValuesPresent;
  }

  getCountsAndValues = (utilizerEntityType, allEntityTypes, allPropertyTypes, results, neighbors) => {
    const utilizerIdToCounts = {};
    const valuesToUtilizerIds = {};
    const fqnToPropertyType = this.getFqnToPropertyType(allPropertyTypes);
    Object.values(allEntityTypes).forEach((entityType) => {
      valuesToUtilizerIds[entityType.id] = {};
      entityType.properties.forEach((propertyId) => {
        valuesToUtilizerIds[entityType.id][propertyId] = {};
      });
    });


    this.props.results.forEach((utilizer) => {
      const entityId = utilizer.id[0];
      utilizerIdToCounts[entityId] = { [utilizerEntityType.id]: {} };

      Object.entries(utilizer).forEach((entry) => {
        const propertyTypeFqn = entry[0];
        if (propertyTypeFqn !== 'count' && propertyTypeFqn !== 'id') {
          const propertyTypeId = fqnToPropertyType[propertyTypeFqn].id;
          utilizerIdToCounts[entityId][utilizerEntityType.id][propertyTypeId] = {};
          entry[1].forEach((value) => {
            const newIdSet = (valuesToUtilizerIds[utilizerEntityType.id][propertyTypeId][value])
              ? valuesToUtilizerIds[utilizerEntityType.id][propertyTypeId][value].add(entityId) : new Set([entityId]);
            valuesToUtilizerIds[utilizerEntityType.id][propertyTypeId][value] = newIdSet;
            const prevVal = utilizerIdToCounts[entityId][utilizerEntityType.id][propertyTypeId][value] || 0;
            utilizerIdToCounts[entityId][utilizerEntityType.id][propertyTypeId][value] = prevVal + 1;
          });
        }
      });

      const utilizerNeighbors = neighbors.get(entityId, Immutable.List());
      const allEntityTypeIds = new Set(Object.keys(this.props.allEntityTypes));
      utilizerNeighbors.forEach((neighbor) => {
        if (neighbor && neighbor.has('neighborEntitySet') && neighbor.has('neighborDetails')) {
          const entityTypeId = neighbor.getIn(['neighborEntitySet', 'entityTypeId']);
          if (allEntityTypeIds.has(entityTypeId)) {
            if (!utilizerIdToCounts[entityId][entityTypeId]) {
              utilizerIdToCounts[entityId][entityTypeId] = {};
            }

            neighbor.get('neighborDetails').entrySeq().forEach((entry) => {
              const propertyTypeFqn = entry[0];
              const propertyTypeId = fqnToPropertyType[propertyTypeFqn].id;
              if (!utilizerIdToCounts[entityId][entityTypeId][propertyTypeId]) {
                utilizerIdToCounts[entityId][entityTypeId][propertyTypeId] = {};
              }

              entry[1].forEach((value) => {
                const newIdSet = (valuesToUtilizerIds[entityTypeId][propertyTypeId][value])
                  ? valuesToUtilizerIds[entityTypeId][propertyTypeId][value].add(entityId) : new Set([entityId]);
                valuesToUtilizerIds[entityTypeId][propertyTypeId][value] = newIdSet;
                const prevVal = utilizerIdToCounts[entityId][entityTypeId][propertyTypeId][value] || 0;
                utilizerIdToCounts[entityId][entityTypeId][propertyTypeId][value] = prevVal + 1;
              });
            });
          }
        }

      });
    });
    this.getHistogramData({}, utilizerIdToCounts, valuesToUtilizerIds, allEntityTypes);
  }

  getFilteredUtilizerIds = (filters, valuesToUtilizerIds, utilizerIdToCounts) => {
    let utilizerIds = Object.keys(utilizerIdToCounts);
    if (Object.keys(filters).length) {
      let filteredUtilizerIds = new Set();
      let filteredUtilizerIdsWasSet = false;
      Object.entries(filters).forEach((entityTypeEntry) => {

        const entityTypeId = entityTypeEntry[0];
        Object.entries(entityTypeEntry[1]).forEach((propertyTypeEntry) => {
          const propertyTypeId = propertyTypeEntry[0];
          const propertyTypeFilteredUtilizerIds = new Set();
          propertyTypeEntry[1].forEach((value) => {
            valuesToUtilizerIds[entityTypeId][propertyTypeId][value].forEach((utilizerId) => {
              propertyTypeFilteredUtilizerIds.add(utilizerId);
            });
          });
          if (!filteredUtilizerIdsWasSet) {
            filteredUtilizerIds = propertyTypeFilteredUtilizerIds;
            filteredUtilizerIdsWasSet = true;
          }
          else {
            filteredUtilizerIds = new Set([...filteredUtilizerIds].filter((utilizerId) => {
              return propertyTypeFilteredUtilizerIds.has(utilizerId);
            }));
          }
        });
      });
      utilizerIds = filteredUtilizerIds;
    }
    return utilizerIds;
  }

  getHistogramData = (
    optionalFilters,
    optionalUtilizerIdToCounts,
    optionalValuesToUtilizerIds,
    optionalAllEntityTypes) => {
    const filters = optionalFilters || this.state.filters;
    const utilizerIdToCounts = optionalUtilizerIdToCounts || this.state.utilizerIdToCounts;
    const valuesToUtilizerIds = optionalValuesToUtilizerIds || this.state.valuesToUtilizerIds;
    const allEntityTypes = optionalAllEntityTypes || this.props.allEntityTypes;

    const histogramCounts = {};

    const utilizerIds = this.getFilteredUtilizerIds(filters, valuesToUtilizerIds, utilizerIdToCounts);

    Object.values(this.props.allEntityTypes).forEach((entityType) => {
      histogramCounts[entityType.id] = {};
      entityType.properties.forEach((propertyId) => {
        histogramCounts[entityType.id][propertyId] = {};
      });
    });

    utilizerIds.forEach((utilizerId) => {
      Object.entries(utilizerIdToCounts[utilizerId]).forEach((entityTypeEntry) => {
        const entityTypeId = entityTypeEntry[0];
        Object.entries(entityTypeEntry[1]).forEach((propertyTypeEntry) => {
          const propertyTypeId = propertyTypeEntry[0];
          Object.entries(propertyTypeEntry[1]).forEach((valueEntry) => {
            const value = valueEntry[0];
            const count = valueEntry[1];
            const prevCount = histogramCounts[entityTypeId][propertyTypeId][value] || 0;
            histogramCounts[entityTypeId][propertyTypeId][value] = prevCount + count;
          });
        });
      });
    });
    const histogramData = this.getFormattedHistogramData(histogramCounts, allEntityTypes);

    this.setState({ filters, utilizerIdToCounts, valuesToUtilizerIds, histogramData });
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

  onFilterSelect = (entityTypeId, propertyTypeId, filter) => {
    const filters = this.state.filters;

    // remove filter if it's currently set
    if (filters[entityTypeId] && filters[entityTypeId][propertyTypeId]
      && filters[entityTypeId][propertyTypeId].includes(filter)) {
      const propertyFilters = filters[entityTypeId][propertyTypeId];
      propertyFilters.splice(propertyFilters.indexOf(filter), 1);
      filters[entityTypeId][propertyTypeId] = propertyFilters;
      if (!filters[entityTypeId][propertyTypeId].length) delete filters[entityTypeId][propertyTypeId];
      if (!Object.values(filters[entityTypeId]).length) delete filters[entityTypeId];
    }

    // otherwise add the filter
    else if (!filters[entityTypeId]) {
      filters[entityTypeId] = { [propertyTypeId]: [filter] };
    }
    else {
      const propertyFilters = filters[entityTypeId][propertyTypeId] || [];
      if (!propertyFilters.includes(filter)) propertyFilters.push(filter);
      filters[entityTypeId][propertyTypeId] = propertyFilters;
    }
    this.getHistogramData(filters);
  }

  renderSingleHistogram = (counts, entityType, propertyType, id) => {
    if (!counts.length) return null;
    const filters = this.state.filters;
    const title = `${entityType.title}: ${propertyType.title}`;
    const propertyFilters = (filters[entityType.id] && filters[entityType.id][propertyType.id])
      ? filters[entityType.id][propertyType.id] : [];
    return (
      <div className={styles.wrappingHistogramContainer} key={id}>
        <h2>{title}</h2>
        <HistogramVisualization
            counts={counts}
            fields={[COUNT_FIELD]}
            height={225}
            width={450}
            filters={propertyFilters}
            onClick={(filter) => {
              this.onFilterSelect(entityType.id, propertyType.id, filter);
            }} />
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
