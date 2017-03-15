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
import { DataModels } from 'loom-data';
import * as formatter from './FormatUtils';
import EdmConsts from '../../../utils/Consts/EdmConsts';
import styles from './styles.module.css';

const labelElementId = 'visualization_label';

export class LineChartVisualization extends React.Component {

  static propTypes = {
    xProp: PropTypes.string,
    yProps: PropTypes.array,
    allProps: PropTypes.array,
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

  xFormatter = (value) => {
    const xProp = JSON.parse(this.props.xProp);
    let formattedValue = `${xProp.title}: `;
    if (EdmConsts.EDM_DATE_TYPES.includes(xProp.datatype)) {
      formattedValue = formattedValue.concat(formatter.formatDate(value));
    }
    else {
      formattedValue = formattedValue.concat(value);
    }
    return formattedValue;
  }

  yFormatter = (value, title) => {
    const yProps = this.props.yProps;
    let formattedValue = value;
    yProps.forEach((prop) => {
      if (title === prop.title && EdmConsts.EDM_DATE_TYPES.includes(prop.datatype)) {
        formattedValue = formatter.formatDate(value);
      }
    });
    return formattedValue;
  }

  formatData = () => {
    const formattedData = [];
    const fqnIsDate = {};
    this.props.allProps.forEach((prop) => {
      fqnIsDate[`${prop.type.namespace}.${prop.type.name}`] = EdmConsts.EDM_DATE_TYPES.includes(prop.datatype);
    });
    this.props.data.forEach((dataPoint) => {
      const formattedPoint = {};
      let isValidPoint = true;
      Object.keys(dataPoint).forEach((key) => {
        if (fqnIsDate[key]) {
          formattedPoint[key] = new Date(dataPoint[key][0]).getTime();
        }
        else {
          const value = parseFloat(dataPoint[key][0]);
          if (isNaN(value)) {
            isValidPoint = false;
          }
          else {
            formattedPoint[key] = value;
          }
        }
      });
      if (isValidPoint) {
        formattedData.push(formattedPoint);
      }
    });
    this.setState({ formattedData });
  }

  render() {
    const { FullyQualifiedName } = DataModels;
    if (!this.props.xProp || !this.props.yProps) return null;

    const xProp = JSON.parse(this.props.xProp);
    const xPropFqn = `${xProp.type.namespace}.${xProp.type.name}`;
    const lines = this.props.yProps.map((prop) => {
      const fqn = new FullyQualifiedName(prop.type.namespace, prop.type.name);
      return (
        <Line
            type="monotone"
            dataKey={fqn.getFullyQualifiedName()}
            name={prop.title}
            stroke="#4509cb"
            key={prop.id} />
      );
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
                domain={['dataMin', 'dataMax']}
                tickFormatter={formatter.getTickFormatter([xProp])} />
            <YAxis tickFormatter={formatter.getTickFormatter(this.props.yProps)} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} labelFormatter={this.xFormatter} formatter={this.yFormatter} />
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
