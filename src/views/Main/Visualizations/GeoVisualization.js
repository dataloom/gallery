import React, { PropTypes } from 'react';
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import StarbucksData from './StarbucksData';
import styles from './styles.module.css';

const labelElementId = 'visualization_label';


export class GeoVisualization extends React.Component {

  static propTypes = {
    entitySetName: PropTypes.string,
    geoProp: PropTypes.string,
    data: PropTypes.object
  }

  getData = () => {
    const result = StarbucksData.starbucksData.map((line) => {
      const lineArray = line.split(',');
      return [{
        long: Number(lineArray[0]),
        lat: Number(lineArray[1]),
        id: lineArray[2],
        label: lineArray[3]
      }];
    });
    return result;
  }

  updateMouseOverPoint = (label) => {
    document.getElementById(labelElementId).innerHTML = label;
  }

  render() {
    const dataToUse = this.getData();
    const scatterPoints = dataToUse.map((point) => {
      return (
        <Scatter
          data={point}
          fill="#8884d8"
          key={point[0].id}
          onMouseOver={() => {
            this.updateMouseOverPoint(point[0].label);
          }}
          onMouseOut={() => {
            this.updateMouseOverPoint('');
          }}
        />
      );
    });
    return (
      <div className={styles.visualizationContainer}>
        <div className={styles.visualizationWrapper}>
          <ScatterChart width={750} height={250}>
            <XAxis
              dataKey="long"
              name="longitude"
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              dataKey="lat"
              name="latitude"
              type="number"
              domain={['dataMin', 'dataMax']}
            />
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

export default GeoVisualization;
