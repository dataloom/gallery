import React, { PropTypes } from 'react';
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import * as formatter from './FormatUtils';
import EdmConsts from '../../utils/Consts/EdmConsts';
import styles from './styles.module.css';

const labelElementId = 'visualization_label';

export class ScatterChartVisualization extends React.Component {

  static propTypes = {
    xProp: PropTypes.string,
    yProp: PropTypes.string,
    data: PropTypes.array
  }

  getFormattedPointData = (point, prop) => {
    if (EdmConsts.EDM_DATE_TYPES.includes(prop.datatype)) {
      return new Date(point[0]).getTime();
    }
    return parseFloat(point[0]);
  }

  tooltipFormatter = (value, title) => {
    const xProp = JSON.parse(this.props.xProp);
    const yProp = JSON.parse(this.props.yProp);
    if (xProp && yProp) {
      if (title === xProp.title && EdmConsts.EDM_DATE_TYPES.includes(xProp.datatype)) {
        return formatter.formatDate(value);
      }
      if (title === yProp.title && EdmConsts.EDM_DATE_TYPES.includes(yProp.datatype)) {
        return formatter.formatDate(value);
      }
    }
    return value;
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
      point[xPropFqn] = this.getFormattedPointData(pointData[xPropFqn], xProp);
      point[yPropFqn] = this.getFormattedPointData(pointData[yPropFqn], yProp);
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
                domain={['dataMin', 'dataMax']}
                tickFormatter={formatter.getTickFormatter([xProp])} />
            <YAxis
                dataKey={yPropFqn}
                name={yProp.title}
                domain={['dataMin', 'dataMax']}
                tickFormatter={formatter.getTickFormatter([yProp])} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={this.tooltipFormatter} />
            {scatterPoints}
          </ScatterChart>
        </div>
        <div className={styles.label} id={labelElementId} />
      </div>
    );
  }
}

export default ScatterChartVisualization;
