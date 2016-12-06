import React, { PropTypes } from 'react';
import Select from 'react-select';
import { ScatterChartVisualization } from './ScatterChartVisualization';
import styles from './styles.module.css';

export class ScatterChartContainer extends React.Component {

  static propTypes = {
    numberProps: PropTypes.array,
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
    const xAxisProp = (e && e !== undefined) ? e.value : undefined;
    this.setState({
      xAxisProp,
      yAxisProp: undefined
    });
  }

  handleYAxisPropChange = (e) => {
    const yAxisProp = (e && e !== undefined) ? e.value : undefined;
    this.setState({ yAxisProp });
  }

  renderScatterChart = () => {
    return (
      <div>
        <ScatterChartVisualization
          xProp={this.state.xAxisProp}
          yProp={this.state.yAxisProp}
          data={this.props.data}
        />
      </div>
    );
  }

  render() {
    const numberProps = this.props.numberProps;
    const { xAxisProp, yAxisProp } = this.state;
    if (numberProps.length <= 1) return null;
    const xAxisPropJson = (xAxisProp !== undefined) ?
      JSON.parse(xAxisProp) : null;
    const yAxisOptions = [];
    const xAxisOptions = numberProps.map((prop) => {
      const fqn = `${prop.namespace}.${prop.name}`;
      if (!(xAxisPropJson && xAxisPropJson.name === prop.name && xAxisPropJson.namespace === prop.namespace)) {
        yAxisOptions.push({ label: fqn, value: JSON.stringify(prop) });
      }
      return { label: fqn, value: JSON.stringify(prop) };
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
                onChange={this.handleXAxisPropChange}
              />
            </div>
            <div className={`${styles.selectButton} ${styles.marginLeft}`}>
              <Select
                placeholder="Choose a property for the y axis"
                options={yAxisOptions}
                value={yAxisProp}
                onChange={this.handleYAxisPropChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScatterChartContainer;
