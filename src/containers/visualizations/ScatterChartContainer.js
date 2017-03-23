import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { ScatterChartVisualization } from './ScatterChartVisualization';
import styles from './styles.module.css';

export class ScatterChartContainer extends React.Component {

  static propTypes = {
    numberProps: PropTypes.instanceOf(Immutable.List),
    dateProps: PropTypes.instanceOf(Immutable.List),
    data: PropTypes.array
  }

  constructor() {
    super();
    this.state = {
      xAxisProp: undefined,
      yAxisProp: undefined
    };
  }

  handleXAxisPropChange = (e) => {
    const xAxisProp = (e) ? e.value : undefined;
    this.setState({
      xAxisProp,
      yAxisProp: undefined
    });
  }

  handleYAxisPropChange = (e) => {
    const yAxisProp = (e) ? e.value : undefined;
    this.setState({ yAxisProp });
  }

  renderScatterChart = () => {
    return (
      <div>
        <ScatterChartVisualization
            xProp={this.state.xAxisProp}
            yProp={this.state.yAxisProp}
            data={this.props.data} />
      </div>
    );
  }

  render() {
    const { numberProps, dateProps } = this.props;
    const { xAxisProp, yAxisProp } = this.state;
    if (numberProps.size + dateProps.size <= 1) return null;
    const xAxisPropJson = (xAxisProp) ? JSON.parse(xAxisProp) : null;
    const xAxisOptions = [];
    const yAxisOptions = [];
    numberProps.concat(dateProps).forEach((prop) => {
      const option = { label: prop.get('title'), value: JSON.stringify(prop.toJSON()) };
      if (!xAxisPropJson || xAxisPropJson.id !== prop.get('id')) {
        yAxisOptions.push(option);
      }
      xAxisOptions.push(option);
    });
    return (
      <div>
        <div className={styles.scatterChartContainer}>
          {this.renderScatterChart()}
        </div>
        <div className={styles.spacerSmall} />
        <div className={styles.inlineBlock}>
          <div className={styles.xAxisSelectWrapper}>
            <div className={styles.selectButton}>
              <Select
                  placeholder="Choose a property for the x axis"
                  options={xAxisOptions}
                  value={xAxisProp}
                  onChange={this.handleXAxisPropChange} />
            </div>
            <div className={`${styles.selectButton} ${styles.marginLeft}`}>
              <Select
                  placeholder="Choose a property for the y axis"
                  options={yAxisOptions}
                  value={yAxisProp}
                  onChange={this.handleYAxisPropChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScatterChartContainer;
