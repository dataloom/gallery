import React, { PropTypes } from 'react';
import Select from 'react-select';
import { Checkbox } from 'react-bootstrap';
import { LineChartVisualization } from './LineChartVisualization';
import styles from './styles.module.css';

export class LineChartContainer extends React.Component {

  static propTypes = {
    numberProps: PropTypes.array,
    dateProps: PropTypes.array,
    data: PropTypes.array
  }

  constructor() {
    super();
    this.state = {
      xAxisProp: undefined,
      selectedYProps: []
    };
  }

  removePropFromArray = (array, prop) => {
    return array.filter((checkedProp) => {
      return checkedProp.id !== prop.id;
    });
  }

  handleXAxisPropChange = (e) => {
    const xAxisProp = (e) ? e.value : undefined;
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
            allProps={this.props.numberProps.concat(this.props.dateProps)}
            data={this.props.data} />
      </div>
    );
  }

  render() {
    const { numberProps, dateProps } = this.props;
    if (numberProps.length + dateProps.length <= 1) return null;
    const xAxisProp = (this.state.xAxisProp) ? JSON.parse(this.state.xAxisProp) : null;
    const checkboxMsg = (xAxisProp) ? `Choose properties to plot against ${xAxisProp.title}` : '';
    const selectOptions = [];
    const checkboxes = numberProps.concat(dateProps).map((prop) => {
      selectOptions.push({ label: prop.title, value: JSON.stringify(prop) });
      if (!xAxisProp || prop.id === xAxisProp.id) return null;
      return (
        <div key={prop.id}>
          <Checkbox
              type="checkbox"
              id={prop.id}
              onClick={this.handleCheckboxChange}
              value={JSON.stringify(prop)}>{prop.title}</Checkbox>
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
                  onChange={this.handleXAxisPropChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LineChartContainer;
