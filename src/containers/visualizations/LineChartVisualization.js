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
import { Models } from 'lattice';
import * as formatter from './FormatUtils';
import EdmConsts from '../../utils/Consts/EdmConsts';
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
    const fqnIsNumber = {};
    this.props.allProps.forEach((prop) => {
      fqnIsDate[`${prop.type.namespace}.${prop.type.name}`] = EdmConsts.EDM_DATE_TYPES.includes(prop.datatype);
      fqnIsNumber[`${prop.type.namespace}.${prop.type.name}`] = EdmConsts.EDM_NUMBER_TYPES.includes(prop.datatype);
    });
    this.props.data.forEach((dataPoint) => {
      const formattedPoint = {};
      let isValidPoint = true;
      Object.keys(dataPoint).forEach((key) => {
        const isDate = fqnIsDate[key];
        const isNum = fqnIsNumber[key];
        let value = dataPoint[key][0];
        if (isDate) value = new Date(value).getTime();
        else if (isNum) value = parseFloat(value);
        formattedPoint[key] = value;
        if ((isNum || isDate) && isNaN(value)) isValidPoint = false;
      });
      if (isValidPoint) formattedData.push(formattedPoint);
    });
    this.setState({ formattedData });
  }

  render() {
    const { FullyQualifiedName } = Models;
    if (!this.props.xProp) return null;

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
