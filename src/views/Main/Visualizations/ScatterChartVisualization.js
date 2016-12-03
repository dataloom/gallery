import React, { PropTypes } from 'react';
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import styles from './styles.module.css';

const labelElementId = 'visualization_label';

export class ScatterChartVisualization extends React.Component {

  static propTypes = {
    xProp: PropTypes.string,
    yProp: PropTypes.string,
    data: PropTypes.array
  }

  render() {
    if (this.props.xProp === undefined || this.props.yProp === undefined || this.props.data === undefined) return null;
    const xProp = JSON.parse(this.props.xProp);
    const yProp = JSON.parse(this.props.yProp);
    const xPropFqn = `${xProp.namespace}.${xProp.name}`;
    const yPropFqn = `${yProp.namespace}.${yProp.name}`;
    let key = 0;
    const scatterPoints = this.props.data.map((pointData) => {
      if (!pointData[xPropFqn] || !pointData[yPropFqn]) return null;
      const point = {};
      point[xPropFqn] = pointData[xPropFqn][0];
      point[yPropFqn] = pointData[yPropFqn][0];
      key += 1;
      return (
        <Scatter
          data={[point]}
          fill="#8884d8"
          key={key}
        />
      );
    });
    return (
      <div className={styles.visualizationContainer}>
        <div className={styles.visualizationWrapper}>
          <ScatterChart width={750} height={250}>
            <XAxis
              dataKey={xPropFqn}
              name={xPropFqn}
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              dataKey={yPropFqn}
              name={yPropFqn}
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            {scatterPoints}
          </ScatterChart>
        </div>
        <div className={styles.label} id={labelElementId} />
      </div>
    );
  }
}

export default ScatterChartVisualization;
