import React, { PropTypes } from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import styles from './styles.module.css';

export class HistogramVisualization extends React.Component {

  static propTypes = {
    counts: PropTypes.array.isRequired,
    fields: PropTypes.array.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.counts !== this.props.counts || nextProps.fields !== this.props.fields);
  }

  render() {
    const data = this.props.counts.map((section) => {
      const formattedObj = {};
      Object.keys(section).forEach((key) => {
        formattedObj[key] = (key === 'name') ? section[key] : parseInt(section[key], 10);
      });
      return formattedObj;
    });
    const bars = this.props.fields.map((fieldName) => {
      return <Bar key={fieldName} dataKey={fieldName} fill="#8884d8" />;
    });

    return (
      <div className={styles.visualizationContainer}>
        <div className={styles.visualizationWrapper}>
          <BarChart
              width={600}
              height={300}
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            {bars}
          </BarChart>
        </div>
      </div>
    );
  }
}

export default HistogramVisualization;
