import React, { PropTypes } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import styles from './styles.module.css';

const labelElementId = 'visualization_label';

export class LineChartVisualization extends React.Component {

  static propTypes = {
    xProp: PropTypes.string,
    yProps: PropTypes.array,
    data: PropTypes.array
  }

  constructor() {
    super();
    this.state = {
      formattedData: []
    };
  }

  componentDidMount() {
    this.formatData();
  }

  formatData = () => {
    const formattedData = this.props.data.map((dataPoint) => {
      const formattedPoint = {};
      Object.keys(dataPoint).forEach((key) => {
        formattedPoint[key] = dataPoint[key][0];
      });
      return formattedPoint;
    });
    this.setState({ formattedData });
  }

  updateMouseOverPoint = (label) => {
    document.getElementById(labelElementId).innerHTML = label;
  }

  render() {
    if (this.props.xProp === undefined || this.props.yProps === undefined) return null;

    const xProp = JSON.parse(this.props.xProp);
    const xPropFqn = `${xProp.namespace}.${xProp.name}`;

    const lines = this.props.yProps.map((prop) => {
      const yPropFqn = `${prop.namespace}.${prop.name}`;
      return <Line type="monotone" dataKey={yPropFqn} stroke="#8884d8" key={yPropFqn} />;
    });

    return (
      <div className={styles.visualizationContainer}>
        <div className={styles.visualizationWrapper}>
          <LineChart
            width={750}
            height={250}
            data={this.state.formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey={xPropFqn}
              name={xPropFqn}
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            {lines}
          </LineChart>
        </div>
        <div className={styles.label} id={labelElementId} />
      </div>
    );
  }
}

export default LineChartVisualization;
