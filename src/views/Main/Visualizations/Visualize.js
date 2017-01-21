import React, { PropTypes } from 'react';
import { AuthorizationApi, EntityDataModelApi, DataApi } from 'loom-data';
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
    'testcsv.height': [63],
    'testcsv.salary': [90000],
    'testcsv.latitude': [61.21759217],
    'testcsv.longitude': [-149.8935557]
  },
  {
    'testcsv.height': [60],
    'testcsv.salary': [84000],
    'testcsv.latitude': [61.19533942],
    'testcsv.longitude': [-149.9054948]
  },
  {
    'testcsv.height': [75],
    'testcsv.salary': [103000],
    'testcsv.latitude': [61.2297],
    'testcsv.longitude': [-149.7522]
  },
  {
    'testcsv.height': [76],
    'testcsv.salary': [99000],
    'testcsv.latitude': [61.19525062],
    'testcsv.longitude': [-149.8643361]
  },
  {
    'testcsv.height': [79],
    'testcsv.salary': [135000],
    'testcsv.latitude': [61.13751355],
    'testcsv.longitude': [-149.8379726]
  },
  {
    'testcsv.height': [80],
    'testcsv.salary': [128000],
    'testcsv.latitude': [61.13994658],
    'testcsv.longitude': [-149.9092788]
  },
  {
    'testcsv.height': [87],
    'testcsv.salary': [162000],
    'testcsv.latitude': [61.19533265],
    'testcsv.longitude': [-149.7364877]
  }
];

const chartTypes = {
  LINE_CHART: VisualizationConsts.LINE_CHART,
  SCATTER_CHART: VisualizationConsts.SCATTER_CHART,
  MAP_CHART: VisualizationConsts.MAP_CHART
};

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
      data: [],
      error: false
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
    return DataApi.getSelectedEntitySetData(this.state.entitySetId, [], propertyTypeIds)
    .then((data) => {
      return data;
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
        title,
        error: false
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
    AuthorizationApi.checkAuthorizations(accessChecks)
    .then((response) => {
      const propsWithReadAccess = [];
      response.forEach((property) => {
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
        this.setState({ error: true });
      });
    }).catch(() => {
      this.setState({ error: true });
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

  renderError = () => {
    if (this.state.error) {
      return <div clsasName={styles.error}>Unable to load visualization.</div>;
    }
    return null;
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
          {this.renderError()}
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
