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

const data = [
  [{
    id: 'd92dae60-626f-468c-b414-eef3e4faebc9',
    iri: 'http://dbpedia.org/resource/Buffalo,_Minnesota',
    label: 'Buffalo, Minnesota',
    lat: 45.17194444444444,
    long: -93.87472222222222
  }],
  [{
    id: '1998f22b-51f0-4002-854f-f32790e60297',
    iri: 'http://dbpedia.org/resource/Buffalo_Municipal_Airport_(Minnesota)',
    label: 'Buffalo Municipal Airport (Minnesota)',
    lat: 45.159166666666664,
    long: 93.84333333333333
  }],
  [{
    id: '30abd9e0-8766-4cdd-8c9e-9834c8c4bbb9',
    iri: 'http://dbpedia.org/resource/Dickinson,_Minnesota',
    label: 'Dickinson, Minnesota',
    lat: 45.117777777777775,
    long: -93.81194444444445
  }],
  [{
    id: '43730baf-f3e8-4883-b597-588293133909',
    iri: 'http://dbpedia.org/resource/Buffalo_High_School_(Buffalo,_Minnesota)',
    label: 'Buffalo High School (Buffalo, Minnesota)',
    lat: 45.1824869,
    long: -93.829996
  }]
];

const labelElementId = 'visualization_label';


export class GeoVisualization extends React.Component {

  static propTypes = {
    entitySetName: PropTypes.string
  }

  constructor() {
    super();
    this.state = {
      entitySetName: PropTypes.string,
      geoProp: PropTypes.string
    };
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
