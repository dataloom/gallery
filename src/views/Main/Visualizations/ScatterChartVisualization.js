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
    const xPropFqn = `${xProp.type.namespace}.${xProp.type.name}`;
    const yPropFqn = `${yProp.type.namespace}.${yProp.type.name}`;
    let key = 0;
    const scatterPoints = [];
    this.props.data.forEach((pointData) => {
      if (!pointData[xPropFqn] || !pointData[yPropFqn]) return;
      const point = {};
      point[xPropFqn] = parseFloat(pointData[xPropFqn][0]);
      point[yPropFqn] = parseFloat(pointData[yPropFqn][0]);
      if (isNaN(point[xPropFqn]) || isNaN(point[yPropFqn])) return;
      key += 1;
      scatterPoints.push(
        <Scatter
            data={[point]}
            fill="#4509cb"
            key={key} />
      );
    });
    return (
      <div className={styles.visualizationContainer}>
        <div className={styles.visualizationWrapper}>
          <ScatterChart width={750} height={250}>
            <XAxis
                dataKey={xPropFqn}
                name={xProp.title}
                type="number"
                domain={['dataMin', 'dataMax']} />
            <YAxis
                dataKey={yPropFqn}
                name={yProp.title}
                type="number"
                domain={['dataMin', 'dataMax']} />
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
