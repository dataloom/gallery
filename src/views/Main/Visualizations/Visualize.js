import React, { PropTypes } from 'react';
import { AuthorizationApi, EntityDataModelApi, DataApi } from 'loom-data';
import { Promise } from 'bluebird';
import AsyncContent, { ASYNC_STATUS } from '../../../components/asynccontent/AsyncContent';
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

const MAX_POINTS_TO_DISPLAY = 1000;

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
    const query = props.location.query;
    if (query.setId !== undefined) {
      entitySetId = query.setId;
    }
    this.state = {
      entitySetId,
      title: StringConsts.EMPTY,
      properties: [],
      numberProps: [],
      geoProps: [],
      currentView: undefined,
      data: [],
      asyncStatus: ASYNC_STATUS.LOADING
    };
  }

  componentDidMount() {
    if (this.state.entitySetId !== undefined) {
      this.loadEntitySetDetails();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.entitySetId !== this.state.entitySetId) {
      if (this.state.entitySetId !== undefined) {
        this.loadEntitySetDetails();
      }
    }
  }

  loadData = (propertyTypes) => {
    const propertyTypeIds = propertyTypes.map((propertyType) => {
      return propertyType.id;
    });
    return DataApi.getEntitySetData(this.state.entitySetId, [], propertyTypeIds)
    .then((data) => {
      if (data.length > MAX_POINTS_TO_DISPLAY) {
        const frequencyToAccept = data.length / MAX_POINTS_TO_DISPLAY;
        const filteredData = data.filter((point, index) => {
          return (index % frequencyToAccept === 0);
        });
        return filteredData;
      }
      return data;
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
        data,
        asyncStatus: ASYNC_STATUS.SUCCESS
      });
    }).catch(() => {
      this.setState({ asyncStatus: ASYNC_STATUS.ERROR });
    });
  }

  loadEntitySetDetails = () => {
    EntityDataModelApi.getEntitySet(this.state.entitySetId)
    .then((entitySet) => {
      this.setState({
        title: entitySet.title
      });
      this.loadEntitySetType(entitySet.entityTypeId);
    });
  }

  loadEntitySetType = (entityTypeId) => {
    EntityDataModelApi.getEntityType(entityTypeId)
    .then((entityType) => {
      this.loadProperties(entityType.properties);
    });
  }

  loadProperties = (propertyIds) => {
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
        this.filterPropDatatypes(propertyTypes);
      }).catch(() => {
        this.setState({ asyncStatus: ASYNC_STATUS.ERROR });
      });
    }).catch(() => {
      this.setState({ asyncStatus: ASYNC_STATUS.ERROR });
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
      return null;
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

  displayEntitySet = (entitySetId) => {
    this.setState({ entitySetId });
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
          <AsyncContent
              status={this.state.asyncStatus}
              errorMessage="Unable to load visualization."
              content={() => {
                return visualization;
              }} />
        </Page.Body>
      </div>
    );
  }

  renderEntitySetVisualizationList = () => {
    return (
      <div>
        <Page.Header>
          <Page.Title>Choose an entity set to visualize</Page.Title>
        </Page.Header>
        <Page.Body>
          <EntitySetVisualizationList displayEntitySetFn={this.displayEntitySet} />
        </Page.Body>
      </div>
    );
  }

  render() {
    const { entitySetId } = this.state;
    const content = (entitySetId === undefined) ?
      this.renderEntitySetVisualizationList() : this.renderVisualization();
    return (
      <Page>
        {content}
      </Page>
    );
  }
}

export default Visualize;
