import React, { PropTypes } from 'react';
import Select from 'react-select';
import { LineChartVisualization } from './LineChartVisualization';
import styles from './styles.module.css';

export class LineChartContainer extends React.Component {

  static propTypes = {
    numberProps: PropTypes.array,
    data: PropTypes.array
  }

  constructor() {
    super();
    this.state = {
      xAxisProp: undefined,
      selectedYProps: undefined
    };
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

  handleXAxisPropChange = (e) => {
    const xAxisProp = (e && e !== undefined) ? e.value : undefined;
    this.setState({
      xAxisProp,
      selectedYProps: []
    });
  }

  handleCheckboxChange = (e) => {
    const prop = JSON.parse(e.target.value);
    let newProps = this.state.selectedYProps;
    if (e.target.checked) newProps.push(prop);
    else newProps = this.removePropFromArray(this.state.selectedYProps, prop);
    this.setState({ selectedYProps: newProps });
  }

  renderLineChart = () => {
    return (
      <div>
        <LineChartVisualization
          xProp={this.state.xAxisProp}
          yProps={this.state.selectedYProps}
          data={this.props.data}
        />
      </div>
    );
  }

  render() {
    const numberProps = this.props.numberProps;
    if (numberProps.length <= 1) return null;
    const xAxisProp = (this.state.xAxisProp !== undefined) ?
      JSON.parse(this.state.xAxisProp) : null;
    const checkboxMsg = (xAxisProp) ? `Choose properties to plot against ${xAxisProp.namespace}.${xAxisProp.name}` : '';
    const selectOptions = [];
    const checkboxes = numberProps.map((prop) => {
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
            className={styles.checkbox}
          />
          <label htmlFor={fqn}>{fqn}</label>
        </div>
      );
    });
    return (
      <div>
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
                value={this.state.xAxisProp}
                onChange={this.handleXAxisPropChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LineChartContainer;
