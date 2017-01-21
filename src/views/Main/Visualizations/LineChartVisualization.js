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
    const formattedData = [];
    this.props.data.forEach((dataPoint) => {
      const formattedPoint = {};
      let isValidPoint = true;
      Object.keys(dataPoint).forEach((key) => {
        const value = parseFloat(dataPoint[key][0]);
        if (isNaN(value)) {
          isValidPoint = false;
        }
        else {
          formattedPoint[key] = value;
        }
      });
      if (isValidPoint) {
        formattedData.push(formattedPoint);
      }
    });
    this.setState({ formattedData });
  }

  updateMouseOverPoint = (label) => {
    document.getElementById(labelElementId).innerHTML = label;
  }

  render() {
    if (!this.props.xProp || !this.props.yProps) return null;

    const xProp = JSON.parse(this.props.xProp);
    const xPropFqn = `${xProp.type.namespace}.${xProp.type.name}`;
    const lines = this.props.yProps.map((prop) => {
      const fqn = `${prop.type.namespace}.${prop.type.name}`
      return <Line type="monotone" dataKey={fqn} name={prop.title} stroke="#4509cb" key={prop.id} />;
    });

    return (
      <div className={styles.visualizationContainer}>
        <div className={styles.visualizationWrapper}>
          <LineChart
              width={750}
              height={250}
              data={this.state.formattedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis
                dataKey={xPropFqn}
                name={xProp.title}
                type="number"
                domain={['dataMin', 'dataMax']} />
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
