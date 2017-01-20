import React, { PropTypes } from 'react';
import { EntityDataModelApi, PermissionsApi, DataApi } from 'loom-data';
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
import Utils from '../../../utils/Utils';
import styles from './styles.module.css';

const serverdata = [
  {
    '15910443-e8cf-4a96-b3b0-05d6a5554f40': [63],
    'a24cff27-9029-42a7-829c-414bd7485be1': [90000]
  },
  {
    '15910443-e8cf-4a96-b3b0-05d6a5554f40': [60],
    'a24cff27-9029-42a7-829c-414bd7485be1': [84000]
  },
  {
    '15910443-e8cf-4a96-b3b0-05d6a5554f40': [75],
    'a24cff27-9029-42a7-829c-414bd7485be1': [103000]
  },
  {
    '15910443-e8cf-4a96-b3b0-05d6a5554f40': [76],
    'a24cff27-9029-42a7-829c-414bd7485be1': [99000]
  },
  {
    '15910443-e8cf-4a96-b3b0-05d6a5554f40': [79],
    'a24cff27-9029-42a7-829c-414bd7485be1': [135000]
  },
  {
    '15910443-e8cf-4a96-b3b0-05d6a5554f40': [80],
    'a24cff27-9029-42a7-829c-414bd7485be1': [128000]
  },
  {
    '15910443-e8cf-4a96-b3b0-05d6a5554f40': [87],
    'a24cff27-9029-42a7-829c-414bd7485be1': [162000]
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
    let name;
    let typeNamespace;
    let typeName;
    let entitySetId;
    let entityTypeId;
    const query = props.location.query;
    if (query.name !== undefined && query.typeNamespace !== undefined && query.typeName !== undefined) {
      name = query.name;
      typeNamespace = query.typeNamespace;
      typeName = query.typeName;
      entitySetId = query.setId;
      entityTypeId = query.typeId;
    }
    this.state = {
      name,
      typeNamespace,
      typeName,
      entitySetId,
      entityTypeId,
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
    if (prevState.name !== this.state.name) {
      this.loadPropertiesIfEntitySetChosen();
    }
  }

  loadData = (propertyTypes) => {
    if (propertyTypes.length < 2) return Promise.resolve();
    const { typeNamespace, typeName, name } = this.state;
    const entityTypeFqn = Utils.getFqnObj(typeNamespace, typeName);
    const propertyTypesList = propertyTypes.map((type) => {
      return Utils.getFqnObj(type.namespace, type.name);
    });
    const propertyTypeIds = propertyTypes.map((propertyType) => {
      return propertyType.id;
    });
    return DataApi.getSelectedEntitySetData(this.state.entitySetId, [baseSyncId], propertyTypeIds)
    .then((data) => {
      // TODO: use real data not mock data

      //return data;
      return serverdata;
    });
  }

  filterPropDatatypes = (properties) => {
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
        data
      });
    });
  }

  loadPropertiesIfEntitySetChosen = () => {
    const { entitySetId, entityTypeId } = this.state;
    if (entitySetId !== undefined && entityTypeId !== undefined) {
      this.loadProperties();
    }
  }

  loadProperties = () => {
    EntityDataModelApi.getEntityType(this.state.entityTypeId)
    .then((entityType) => {
      const accessChecks = entityType.properties.map((propertyId) => {
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
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InN1cHBvcnRAa3J5cHRub3N0aWMuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJhcHBfbWV0YWRhdGEiOnsicm9sZXMiOlsidXNlciIsImFkbWluIiwiQXV0aGVudGljYXRlZFVzZXIiXX0sIm5pY2tuYW1lIjoic3VwcG9ydCIsInJvbGVzIjpbInVzZXIiLCJhZG1pbiIsIkF1dGhlbnRpY2F0ZWRVc2VyIl0sInVzZXJfaWQiOiJhdXRoMHw1N2U0YjJkOGQ5ZDFkMTk0Nzc4ZmQ1YjYiLCJpc3MiOiJodHRwczovL2xvb20uYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU3ZTRiMmQ4ZDlkMWQxOTQ3NzhmZDViNiIsImF1ZCI6IlBUbXlFeGRCY2tIQWl5T2poNHcyTXFTSVVHV1dFZGY4IiwiZXhwIjoxNDg0ODgzMzYzLCJpYXQiOjE0ODQ4NDczNjN9.KduExjVxtKXrKSDoRtFvU4IW2WQdLK7XQufo8r_OLq4'
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
          this.filterPropDatatypes(propertyTypes);
        }).catch(() => {
          console.log('unable to load property types');
        });
      }).catch(() => {
        console.log('unable to determine authorization on property types');
      });
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

  displayEntitySet = (name, typeNamespace, typeName) => {
    this.setState({
      name,
      typeNamespace,
      typeName
    });
  }

  renderVisualization = () => {
    const { currentView, name, data, numberProps, geoProps } = this.state;
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
          <Page.Title>{name}</Page.Title>
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
    const { name, typeName, typeNamespace } = this.state;
    const content = (name === undefined || typeName === undefined || typeNamespace === undefined) ?
      this.renderEntitySetVisualizationList() : this.renderVisualization();
    return (
      <Page>
        {content}
      </Page>
    );
  }
}

export default Visualize;
