import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { Promise } from 'bluebird';
import Select from 'react-select';
import { LineChartVisualization } from './LineChartVisualization';
import StringConsts from '../../../utils/Consts/StringConsts';
import EdmConsts from '../../../utils/Consts/EdmConsts';
import Utils from '../../../utils/Utils';
import styles from './styles.module.css';

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
      selectedYProps: []
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

  handleCheckboxChange = (e) => {
    const prop = JSON.parse(e.target.value);
    const newProps = this.state.selectedYProps;
    if (e.target.checked) {
      newProps.push(prop);
    }
    else {
      let indexToRemove = -1;
      newProps.forEach((oldProp) => {
        if (oldProp.name === prop.name && oldProp.namespace === prop.namespace) {
          indexToRemove = newProps.indexOf(oldProp);
        }
      });
      if (indexToRemove > -1) newProps.splice(indexToRemove, 1);
    }
    this.setState({ selectedYProps: newProps });
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
        <div>
          <input type="checkbox" id={fqn} onClick={this.handleCheckboxChange} value={JSON.stringify(prop)} /><label htmlFor={fqn}>{fqn}</label>
        </div>
      );
    });
    return (
      <div>
        <div className={styles.chartAndCheckboxesWrapper}>
          <div className={styles.checkboxes}>
            {checkboxMsg}
            <div className={styles.spacerSmall} />
            {checkboxes}
          </div>
          <div className={styles.chartWrapper}>
            {this.renderLineChart()}
          </div>
        </div>
        <div className={styles.xAxisSelectWrapper}>
          <Select
            placeholder="Choose a property for the x axis"
            options={selectOptions}
            value={this.state.lineChartXAxisProp}
            onChange={this.handleLineChartXAxisPropChange}
          />
        </div>
      </div>
    );
  }

  render() {
    const numberTypes = this.state.numberProps.map((prop) => {
      return <div key={prop.name}>{`${prop.namespace}.${prop.name}, ${prop.datatype}`}</div>;
    });
    const geoTypes = this.state.geoProps.map((prop) => {
      return <div key={prop.name}>{`${prop.namespace}.${prop.name}, ${prop.datatype}`}</div>;
    });
    const allTypes = this.state.properties.map((prop) => {
      return <div key={prop.name}>{`${prop.namespace}.${prop.name}, ${prop.datatype}`}</div>;
    });
    return (
      <div style={{ textAlign: 'center' }}>visualize!!!
        <h1>Number Types</h1>
        {numberTypes}
        <h1>Geo Types</h1>
        {geoTypes}
        <h1>All Types</h1>
        {allTypes}
        <div className={styles.lineChartContainer}>
          {this.renderLineChartContainer()}
        </div>
      </div>
    );
  }
}

export default Visualize;
