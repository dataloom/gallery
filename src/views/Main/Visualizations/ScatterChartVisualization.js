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
    let key = 0;
    const scatterPoints = [];
    this.props.data.forEach((pointData) => {
      if (!pointData[xProp.id] || !pointData[yProp.id]) return;
      const point = {};
      point[xProp.id] = parseFloat(pointData[xProp.id][0]);
      point[yProp.id] = parseFloat(pointData[yProp.id][0]);
      if (isNaN(point[xProp.id]) || isNaN(point[yProp.id])) return;
      key += 1;
      scatterPoints.push(
        <Scatter
            data={[point]}
            fill="#8884d8"
            key={key} />
      );
    });
    return (
      <div className={styles.visualizationContainer}>
        <div className={styles.visualizationWrapper}>
          <ScatterChart width={750} height={250}>
            <XAxis
                dataKey={xProp.id}
                name={xProp.title}
                type="number"
                domain={['dataMin', 'dataMax']} />
            <YAxis
                dataKey={yProp.id}
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
