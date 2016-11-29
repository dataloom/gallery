import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { Promise } from 'bluebird';
import Select from 'react-select';
import { LineChartVisualization } from './LineChartVisualization';
import { ScatterChartVisualization } from './ScatterChartVisualization';
import EdmConsts from '../../../utils/Consts/EdmConsts';
import Utils from '../../../utils/Utils';
import styles from './styles.module.css';

const chartTypes = {
  LINE_CHART: 'Line Chart Visualizations',
  SCATTER_CHART: 'Scatter Chart Visualizations',
  GEO_CHART: 'Geographical Visualizations'
};

export class Visualize extends React.Component {

  static propTypes = {
    location: PropTypes.object
  }

  constructor(props) {
    super(props);
    const query = props.location.query;
    this.state = {
      name: query.name,
      typeNamespace: query.typeNamespace,
      typeName: query.typeName,
      properties: [],
      numberProps: [],
      geoProps: [],
      lineChartXAxisProp: undefined,
      selectedYProps: [],
      scatterChartXAxisProp: undefined,
      scatterChartYAxisProp: undefined,
      currentView: undefined
    };
  }

  filterPropDatatypes = (properties) => {
    const numberProps = [];
    const geoProps = [];
    properties.forEach((prop) => {
      if (EdmConsts.EDM_NUMBER_TYPES.includes(prop.datatype)) numberProps.push(prop);
      if (EdmConsts.EDM_GEOGRAPHY_TYPES.includes(prop.datatype)) geoProps.push(prop);
    });
    this.setState({
      properties,
      numberProps,
      geoProps
    });
  }

  loadProperties = () => {
    EntityDataModelApi.getEntityType(Utils.getFqnObj(this.state.typeNamespace, this.state.typeName))
    .then((type) => {
      const allPropertiesAsync = type.properties.map((prop) => {
        return EntityDataModelApi.getPropertyType(prop);
      });
      Promise.all(allPropertiesAsync).then((properties) => {
        this.filterPropDatatypes(properties);
      });
    });
  }

  componentDidMount() {
    this.loadProperties();
  }

  handleLineChartXAxisPropChange = (e) => {
    const lineChartXAxisProp = (e && e !== undefined) ? e.value : undefined;
    this.setState({
      lineChartXAxisProp,
      selectedYProps: []
    });
  }

  handleScatterChartXAxisPropChange = (e) => {
    const scatterChartXAxisProp = (e && e !== undefined) ? e.value : undefined;
    this.setState({
      scatterChartXAxisProp,
      scatterChartYAxisProp: undefined
    });
  }

  handleScatterChartYAxisPropChange = (e) => {
    const scatterChartYAxisProp = (e && e !== undefined) ? e.value : undefined;
    this.setState({ scatterChartYAxisProp });
  }

  renderLineChart = () => {
    return (
      <div>
        <LineChartVisualization
          xProp={this.state.lineChartXAxisProp}
          yProps={this.state.selectedYProps}
          entitySetName={this.state.name}
        />
      </div>
    );
  }

  renderScatterChart = () => {
    return (
      <div>
        <ScatterChartVisualization
          xProp={this.state.scatterChartXAxisProp}
          yProp={this.state.scatterChartYAxisProp}
          entitySetName={this.state.name}
        />
      </div>
    );
  }

  removePropFromArray = (array, prop) => {
    let indexToRemove = -1;
    array.forEach((oldProp) => {
      if (oldProp.name === prop.name && oldProp.namespace === prop.namespace) {
        indexToRemove = array.indexOf(oldProp);
      }
    });
    if (indexToRemove > -1) array.splice(indexToRemove, 1);
  }

  handleCheckboxChange = (e) => {
    const prop = JSON.parse(e.target.value);
    let newProps = this.state.selectedYProps;
    if (e.target.checked) newProps.push(prop);
    else newProps = this.removePropFromArray(this.state.selectedYProps, prop);
    this.setState({ selectedYProps: newProps });
  }

  renderGeoChartContainer = () => {
    return null;
  }

  renderScatterChartContainer = () => {
    if (this.state.numberProps.length <= 1) return null;
    const xAxisProp = (this.state.scatterChartXAxisProp !== undefined) ?
      JSON.parse(this.state.scatterChartXAxisProp) : null;
    const yAxisOptions = [];
    const xAxisOptions = this.state.numberProps.map((prop) => {
      const fqn = `${prop.namespace}.${prop.name}`;
      if (!(xAxisProp && xAxisProp.name === prop.name && xAxisProp.namespace === prop.namespace)) {
        yAxisOptions.push({ label: fqn, value: JSON.stringify(prop) });
      }
      return { label: fqn, value: JSON.stringify(prop) };
    });
    return (
      <div>
        <h1>Scatter Chart Visualization</h1>
        <div className={styles.chartContainer}>
          {this.renderScatterChart()}
        </div>
        <div className={styles.spacerSmall} />
        <div className={styles.inlineBlock}>
          <div className={styles.xAxisSelectWrapper}>
            <div className={styles.selectButton}>
              <Select
                placeholder="Choose a property for the x axis"
                options={xAxisOptions}
                value={this.state.scatterChartXAxisProp}
                onChange={this.handleScatterChartXAxisPropChange}
              />
            </div>
            <div className={`${styles.selectButton} ${styles.marginLeft}`}>
              <Select
                placeholder="Choose a property for the y axis"
                options={yAxisOptions}
                value={this.state.scatterChartYAxisProp}
                onChange={this.handleScatterChartYAxisPropChange}
              />
            </div>
          </div>
        </div>
      </div>
    );

  }

  renderLineChartContainer = () => {
    if (this.state.numberProps.length <= 1) return null;
    const xAxisProp = (this.state.lineChartXAxisProp !== undefined) ?
      JSON.parse(this.state.lineChartXAxisProp) : null;
    const checkboxMsg = (xAxisProp) ? `Choose properties to plot against ${xAxisProp.namespace}.${xAxisProp.name}` : '';
    const selectOptions = [];
    const checkboxes = this.state.numberProps.map((prop) => {
      const fqn = `${prop.namespace}.${prop.name}`;
      selectOptions.push({ label: fqn, value: JSON.stringify(prop) });
      if (!xAxisProp || (prop.name === xAxisProp.name && prop.namespace === xAxisProp.namespace)) return null;
      return (
        <div key={fqn}>
          <input
            type="checkbox"
            id={fqn}
            onClick={this.handleCheckboxChange}
            value={JSON.stringify(prop)}
          />
          <label htmlFor={fqn}>{fqn}</label>
        </div>
      );
    });
    return (
      <div>
        <h1>Line Chart Visualization</h1>
        <div className={styles.chartAndCheckboxesWrapper}>
          {checkboxMsg}
          <div className={styles.spacerMed} />
          <div className={styles.checkboxes}>
            {checkboxes}
          </div>
          <div className={styles.chartWrapper}>
            {this.renderLineChart()}
          </div>
        </div>
        <div className={styles.inlineBlock}>
          <div className={styles.xAxisSelectWrapper}>
            <div className={styles.selectButton}>
              <Select
                placeholder="Choose a property for the x axis"
                options={selectOptions}
                value={this.state.lineChartXAxisProp}
                onChange={this.handleLineChartXAxisPropChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  switchView = (newView) => {
    this.setState({
      currentView: newView,
      scatterChartXAxisProp: undefined,
      scatterChartYAxisProp: undefined,
      lineChartXAxisProp: undefined,
      selectedYProps: []
    });
  }

  getOptionButtonClass = (option) => {
    return (option === this.state.currentView) ? `${styles.optionButton} ${styles.selected}` : styles.optionButton;
  }

  getAvailableVisualizations = () => {
    const options = [];
    if (this.state.numberProps.length > 1) {
      options.push(chartTypes.SCATTER_CHART);
      options.push(chartTypes.LINE_CHART);
    }
    if (this.state.geoProps.length > 0) options.push(chartTypes.GEO_CHART);
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
          key={option}
        >{option}
        </button>
      );
    });
    return (
      <div className={styles.optionsBar}>
        {optionsBar}
      </div>
    );
  }

  render() {
    let visualization = null;
    const allVisualizations = this.getAvailableVisualizations();
    let currentView = null;
    if (allVisualizations.length > 0) {
      currentView = (this.state.currentView !== undefined) ? this.state.currentView : allVisualizations[0];
      switch (currentView) {
        case chartTypes.SCATTER_CHART:
          visualization = this.renderScatterChartContainer();
          break;
        case chartTypes.LINE_CHART:
          visualization = this.renderLineChartContainer();
          break;
        case chartTypes.GEO_CHART:
          visualization = this.renderGeoChartContainer();
          break;
        default:
          visualization = null;
      }
    }
    return (
      <div className={styles.container}>
        {this.renderViewOptions()}
        <div className={styles.lineChartContainer}>
          {visualization}
        </div>
      </div>
    );
  }
}

export default Visualize;
