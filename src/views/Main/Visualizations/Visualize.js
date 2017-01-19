import React, { PropTypes } from 'react';
import { EntityDataModelApi, PermissionsApi, DataApi } from 'loom-data';
import { Promise } from 'bluebird';
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
    let name;
    let typeNamespace;
    let typeName;
    const query = props.location.query;
    if (query.name !== undefined && query.typeNamespace !== undefined && query.typeName !== undefined) {
      name = query.name;
      typeNamespace = query.typeNamespace;
      typeName = query.typeName;
    }
    this.state = {
      name,
      typeNamespace,
      typeName,
      properties: [],
      numberProps: [],
      geoProps: [],
      currentView: undefined,
      data: []
    };
  }

  loadData = (propertyTypes) => {
    if (propertyTypes.length < 2) return Promise.resolve();
    const { typeNamespace, typeName, name } = this.state;
    const entityTypeFqn = Utils.getFqnObj(typeNamespace, typeName);
    const propertyTypesList = propertyTypes.map((type) => {
      return Utils.getFqnObj(type.namespace, type.name);
    });
    return DataApi.getSelectedEntitiesOfTypeInSet(entityTypeFqn, name, propertyTypesList)
    .then((data) => {
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
        const propName = prop.name.trim().toLowerCase();
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
    const { name, typeName, typeNamespace } = this.state;
    if (name !== undefined && typeName !== undefined && typeNamespace !== undefined) {
      this.loadProperties();
    }
  }

  loadProperties = () => {
    Promise.join(
      EntityDataModelApi.getEntityType(Utils.getFqnObj(this.state.typeNamespace, this.state.typeName)),
      PermissionsApi.getAclsForPropertyTypesInEntitySet(this.state.name),
      (type, propertyTypePermissions) => {
        const allPropertiesAsync = [];
        type.properties.forEach((prop) => {
          const permissions = propertyTypePermissions[`${prop.namespace}.${prop.name}`];
          if (permissions.includes(Permission.READ.name) || permissions.includes(Permission.WRITE.name)) {
            allPropertiesAsync.push(EntityDataModelApi.getPropertyType(prop));
          }
        });
        Promise.all(allPropertiesAsync).then((properties) => {
          this.filterPropDatatypes(properties);
        });
      }
    );
  }

  componentDidMount() {
    this.loadPropertiesIfEntitySetChosen();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.name !== this.state.name) {
      this.loadPropertiesIfEntitySetChosen();
    }
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
    const title = (visualization) ? currentView : StringConsts.EMPTY;
    return (
      <div>
        {this.renderViewOptions()}
        <div className={styles.entitySetName}>{name}</div>
        <h1>{title}</h1>
        <div>
          {visualization}
        </div>
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
      <div className={styles.container}>
        {content}
      </div>
    );
  }
}

export default Visualize;
