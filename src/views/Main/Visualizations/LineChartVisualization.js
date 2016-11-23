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

const lineData = [
  { year: 1994, people: 300, a: 47 },
  { year: 1995, people: 305, a: 51 },
  { year: 1996, people: 321, a: 54 },
  { year: 1997, people: 323, a: 70 },
  { year: 1998, people: 318, a: 69 },
  { year: 1999, people: 340, a: 75 },
  { year: 2000, people: 408, a: 90 },
  { year: 2001, people: 425, a: 95 },
  { year: 2002, people: 515, a: 133 },
  { year: 2003, people: 502, a: 143 },
  { year: 2004, people: 541, a: 161 },
  { year: 2005, people: 561, a: 201 },
  { year: 2006, people: 594, a: 184 },
  { year: 2007, people: 677, a: 190 },
  { year: 2008, people: 731, a: 224 },
  { year: 2009, people: 623, a: 281 },
  { year: 2010, people: 608, a: 231 },
  { year: 2011, people: 509, a: 202 },
  { year: 2012, people: 580, a: 170 },
  { year: 2013, people: 602, a: 205 },
  { year: 2014, people: 634, a: 230 },
  { year: 2015, people: 640, a: 269 },
  { year: 2016, people: 680, a: 298 }
];

const labelElementId = 'visualization_label';


export class LineChartVisualization extends React.Component {

  static propTypes = {
    entitySetName: PropTypes.string
  }

  updateMouseOverPoint = (label) => {
    document.getElementById(labelElementId).innerHTML = label;
  }

  render() {
    return (
      <div className={styles.visualizationContainer}>
        <div className={styles.visualizationWrapper}>
          <LineChart width={750} height={250} data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="year"
              name="year"
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Line type="monotone" dataKey="people" stroke="#8884d8" />
            <Line type="monotone" dataKey="a" stroke="#82ca9d" />
          </LineChart>
        </div>
        <div className={styles.label} id={labelElementId} />
      </div>
    );
  }
}

export default LineChartVisualization;
