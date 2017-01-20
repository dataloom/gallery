import React, { PropTypes } from 'react';
import { EntityDataModelApi, DataApi } from 'loom-data';
import axios from 'axios';
import { Promise } from 'bluebird';
import Page from '../../../components/page/Page';
import { LineChartContainer } from './LineChartContainer';
import { ScatterChartContainer } from './ScatterChartContainer';
import { GeoContainer } from './GeoContainer';
import { EntitySetVisualizationList } from './EntitySetVisualizationList';
import EdmConsts from '../../../utils/Consts/EdmConsts';
import { Permission } from '../../../core/permissions/Permission';
import StringConsts from '../../../utils/Consts/StringConsts';
import VisualizationConsts from '../../../utils/Consts/VisualizationConsts';
import styles from './styles.module.css';

const mockdata = [
  {
    'eafff9f7-4ad4-4f2c-98f0-793c1769436a': [63],
    '23d1ab60-aaff-4270-9b7c-aedd5345a4a9': [90000],
    'a7493f10-2b66-4ac1-bc7c-36d69af71c64': [61.21759217],
    'abc9e586-56c8-4879-ae73-907034610569': [-149.8935557]
  },
  {
    'eafff9f7-4ad4-4f2c-98f0-793c1769436a': [60],
    '23d1ab60-aaff-4270-9b7c-aedd5345a4a9': [84000],
    'a7493f10-2b66-4ac1-bc7c-36d69af71c64': [61.19533942],
    'abc9e586-56c8-4879-ae73-907034610569': [-149.9054948]
  },
  {
    'eafff9f7-4ad4-4f2c-98f0-793c1769436a': [75],
    '23d1ab60-aaff-4270-9b7c-aedd5345a4a9': [103000],
    'a7493f10-2b66-4ac1-bc7c-36d69af71c64': [61.2297],
    'abc9e586-56c8-4879-ae73-907034610569': [-149.7522]
  },
  {
    'eafff9f7-4ad4-4f2c-98f0-793c1769436a': [76],
    '23d1ab60-aaff-4270-9b7c-aedd5345a4a9': [99000],
    'a7493f10-2b66-4ac1-bc7c-36d69af71c64': [61.19525062],
    'abc9e586-56c8-4879-ae73-907034610569': [-149.8643361]
  },
  {
    'eafff9f7-4ad4-4f2c-98f0-793c1769436a': [79],
    '23d1ab60-aaff-4270-9b7c-aedd5345a4a9': [135000],
    'a7493f10-2b66-4ac1-bc7c-36d69af71c64': [61.13751355],
    'abc9e586-56c8-4879-ae73-907034610569': [-149.8379726]
  },
  {
    'eafff9f7-4ad4-4f2c-98f0-793c1769436a': [80],
    '23d1ab60-aaff-4270-9b7c-aedd5345a4a9': [128000],
    'a7493f10-2b66-4ac1-bc7c-36d69af71c64': [61.13994658],
    'abc9e586-56c8-4879-ae73-907034610569': [-149.9092788]
  },
  {
    'eafff9f7-4ad4-4f2c-98f0-793c1769436a': [87],
    '23d1ab60-aaff-4270-9b7c-aedd5345a4a9': [162000],
    'a7493f10-2b66-4ac1-bc7c-36d69af71c64': [61.19533265],
    'abc9e586-56c8-4879-ae73-907034610569': [-149.7364877]
  }
];

const chartTypes = {
  LINE_CHART: VisualizationConsts.LINE_CHART,
  SCATTER_CHART: VisualizationConsts.SCATTER_CHART,
  MAP_CHART: VisualizationConsts.MAP_CHART
};

const baseSyncId = '00000000-0000-0000-0000-000000000000';

export class Visualize extends React.Component {

  static propTypes = {
    location: PropTypes.object
  }

  constructor(props) {
    super(props);
    let entitySetId;
    let entityTypeId;
    const query = props.location.query;
    if (query.setId !== undefined && query.typeId !== undefined) {
      entitySetId = query.setId;
      entityTypeId = query.typeId;
    }
    this.state = {
      entitySetId,
      entityTypeId,
      title: StringConsts.EMPTY,
      properties: [],
      numberProps: [],
      geoProps: [],
      currentView: undefined,
      data: []
    };
  }

  componentDidMount() {
    this.loadPropertiesIfEntitySetChosen();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.entitySetId !== this.state.entitySetId) {
      this.loadPropertiesIfEntitySetChosen();
    }
  }

  loadData = (propertyTypes) => {
    const propertyTypeIds = propertyTypes.map((propertyType) => {
      return propertyType.id;
    });
    return DataApi.getSelectedEntitySetData(this.state.entitySetId, [baseSyncId], propertyTypeIds)
    .then((data) => {
      // TODO: use real data not mock data

      // return data;
      return mockdata;
    });
  }

  filterPropDatatypes = (properties, title) => {
    let latProp = null;
    let longProp = null;
    const numberProps = [];
    properties.forEach((prop) => {
      if (EdmConsts.EDM_NUMBER_TYPES.includes(prop.datatype)) {
        numberProps.push(prop);
        const propName = prop.type.name.trim().toLowerCase();
        if (propName === VisualizationConsts.LATITUDE) {
          latProp = prop;
        }
        else if (propName === VisualizationConsts.LONGITUDE) {
          longProp = prop;
        }
      }
    });
    const geoProps = (!latProp || !longProp) ? [] : [latProp, longProp];
    const chartOptions = this.getAvailableVisualizations(numberProps, geoProps);
    const currentView = (chartOptions.length > 0) ? chartOptions[0] : undefined;
    this.loadData(numberProps)
    .then((data) => {
      this.setState({
        properties,
        numberProps,
        geoProps,
        currentView,
        data,
        title
      });
    });
  }

  loadPropertiesIfEntitySetChosen = () => {
    const { entitySetId, entityTypeId } = this.state;
    if (entitySetId !== undefined && entityTypeId !== undefined) {
      this.loadEntitySetType();
    }
  }

  loadEntitySetType = () => {
    Promise.join(
      EntityDataModelApi.getEntitySet(this.state.entitySetId),
      EntityDataModelApi.getEntityType(this.state.entityTypeId),
      (entitySet, entityType) => {
        this.loadProperties(entityType.properties, entitySet.title);
      }
    );
  }

  loadProperties = (propertyIds, title) => {
    const accessChecks = propertyIds.map((propertyId) => {
      return {
        aclKey: [this.state.entitySetId, propertyId],
        permissions: [Permission.READ.name]
      };
    });
    axios({
      url: 'http://localhost:8080/datastore/authorizations',
      method: 'post',
      contentType: 'application/json',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InN1cHBvcnRAa3J5cHRub3N0aWMuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJhcHBfbWV0YWRhdGEiOnsicm9sZXMiOlsidXNlciIsImFkbWluIiwiQXV0aGVudGljYXRlZFVzZXIiXSwib3JnYW5pemF0aW9ucyI6WyJsb29tIl19LCJuaWNrbmFtZSI6InN1cHBvcnQiLCJyb2xlcyI6WyJ1c2VyIiwiYWRtaW4iLCJBdXRoZW50aWNhdGVkVXNlciJdLCJ1c2VyX2lkIjoiYXV0aDB8NTdlNGIyZDhkOWQxZDE5NDc3OGZkNWI2IiwiaXNzIjoiaHR0cHM6Ly9sb29tLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1N2U0YjJkOGQ5ZDFkMTk0Nzc4ZmQ1YjYiLCJhdWQiOiJQVG15RXhkQmNrSEFpeU9qaDR3Mk1xU0lVR1dXRWRmOCIsImV4cCI6MTQ4NDk3MTQ3OSwiaWF0IjoxNDg0OTM1NDc5fQ.so8m3FdbO4CNo8G1LPYuEgLHe28Z4cFYRHbOPucjm4k'
      },
      data: accessChecks
    })
    .then((response) => {
      const propsWithReadAccess = [];
      response.data.forEach((property) => {
        if (property.permissions.READ) {
          propsWithReadAccess.push(property.aclKey[1]);
        }
      });
      const propertyTypePromises = propsWithReadAccess.map((propId) => {
        return EntityDataModelApi.getPropertyType(propId);
      });
      Promise.all(propertyTypePromises).then((propertyTypes) => {
        this.filterPropDatatypes(propertyTypes, title);
      }).catch(() => {
        console.log('unable to load property types');
      });
    }).catch(() => {
      console.log('unable to determine authorization on property types');
    });
  }

  switchView = (newView) => {
    this.setState({
      currentView: newView
    });
  }

  getOptionButtonClass = (option) => {
    return (option === this.state.currentView) ? `${styles.optionButton} ${styles.selected}` : styles.optionButton;
  }

  getAvailableVisualizations = (optionalNumberProps, optionalGeoProps) => {
    const numberProps = (optionalNumberProps !== undefined) ? optionalNumberProps : this.state.numberProps;
    const geoProps = (optionalGeoProps !== undefined) ? optionalGeoProps : this.state.geoProps;
    const options = [];
    if (numberProps.length > 1) {
      options.push(chartTypes.SCATTER_CHART);
      options.push(chartTypes.LINE_CHART);
    }
    if (geoProps.length > 0) options.push(chartTypes.MAP_CHART);
    return options;
  }

  renderViewOptions = () => {
    const options = this.getAvailableVisualizations();
    if (options.length === 0) {
      return (
        <div className={styles.optionsBar}>
          There are no visualizations available for this entity set.
        </div>
      );
    }
    const optionsBar = options.map((option) => {
      return (
        <button
            onClick={() => {
              this.switchView(option);
            }}
            className={this.getOptionButtonClass(option)}
            key={option}>{option}</button>
      );
    });
    return (
      <div className={styles.optionsBar}>
        {optionsBar}
      </div>
    );
  }

  displayEntitySet = (entitySetId, entityTypeId) => {
    this.setState({
      entitySetId,
      entityTypeId
    });
  }

  renderVisualization = () => {
    const { currentView, title, data, numberProps, geoProps } = this.state;
    let visualization = null;
    switch (currentView) {
      case chartTypes.SCATTER_CHART:
        visualization = <ScatterChartContainer data={data} numberProps={numberProps} />;
        break;
      case chartTypes.LINE_CHART:
        visualization = <LineChartContainer data={data} numberProps={numberProps} />;
        break;
      case chartTypes.MAP_CHART:
        visualization = <GeoContainer data={data} geoProps={geoProps} />;
        break;
      default:
        visualization = null;
    }
    return (
      <div>
        <Page.Header>
          <Page.Title>{title}</Page.Title>
          {this.renderViewOptions()}
        </Page.Header>
        <Page.Body>
          {visualization}
        </Page.Body>
      </div>
    );
  }

  renderEntitySetVisualizationList = () => {
    return (
      <div className={styles.container}>
        <EntitySetVisualizationList displayEntitySetFn={this.displayEntitySet} />
      </div>
    );
  }

  render() {
    const { entitySetId, entityTypeId } = this.state;
    const content = (entitySetId === undefined || entityTypeId === undefined) ?
      this.renderEntitySetVisualizationList() : this.renderVisualization();
    return (
      <Page>
        {content}
      </Page>
    );
  }
}

export default Visualize;
