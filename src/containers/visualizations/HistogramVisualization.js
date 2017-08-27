import React, { PropTypes } from 'react';
import {
  Cell,
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
    fields: PropTypes.array.isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    onClick: PropTypes.func,
    filters: PropTypes.array
  }

  static defaultProps = {
    height: 300,
    width: 600,
    onClick: () => {},
    filters: []
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.counts !== this.props.counts || nextProps.fields !== this.props.fields);
  }

  render() {
    const bars = this.props.fields.map((fieldName) => {
      return (
        <Bar
            key={fieldName}
            dataKey={fieldName}
            fill="#8884d8"
            onClick={(bar) => {
              this.props.onClick(bar.name);
            }}>
          {
            this.props.counts.map((entry) => {
              return (
                <Cell
                    key={entry.name}
                    fill={this.props.filters.includes(entry.name) ? '#4203c5' : '#8884d8'} />
              );
            })
          }

        </Bar>
      );
    });

    return (
      <div className={styles.visualizationContainer}>
        <div className={styles.visualizationWrapper}>
          <BarChart
              width={this.props.width}
              height={this.props.height}
              data={this.props.counts}
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
