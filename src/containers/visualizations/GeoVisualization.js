import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { divIcon } from 'leaflet';
import { Map, Marker, TileLayer } from 'react-leaflet';
import VisualizationConsts from '../../utils/Consts/VisualizationConsts';
import styles from './styles.module.css';

export class GeoVisualization extends React.Component {

  static propTypes = {
    mapProp: PropTypes.object,
    data: PropTypes.array
  }

  render() {
    const { mapProp, data } = this.props;
    if (!mapProp) return null;
    const icon = divIcon({ className: styles.divIcon });
    let latFqn;
    let longFqn;
    let pointFqn;
    if (mapProp.get('latProp')) {
      latFqn = `${mapProp.get('latProp').type.namespace}.${mapProp.get('latProp').type.name}`;
      longFqn = `${mapProp.get('longProp').type.namespace}.${mapProp.get('longProp').type.name}`;
    }
    else pointFqn = `${mapProp.get('type').namespace}.${mapProp.get('type').name}`;
    let maxLat = -90;
    let minLat = 90;
    let maxLong = -180;
    let minLong = 180;

    const markers = [];
    data.forEach((point) => {
      let lat;
      let long;
      if (mapProp.latProp) {
        lat = parseFloat(point[latFqn][0]);
        long = parseFloat(point[longFqn][0]);
      }
      else {
        const latLongArray = point[pointFqn][0].split(',');
        lat = parseFloat(latLongArray[0]);
        long = parseFloat(latLongArray[1]);
      }
      if (isNaN(lat) || isNaN(long)) return;
      const position = [lat, long];
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (long < minLong) minLong = long;
      if (long > maxLong) maxLong = long;
      markers.push(<Marker position={position} icon={icon} key={data.indexOf(point)} />);
    });

    if (minLat === maxLat && minLong === maxLong) {
      minLat -= VisualizationConsts.DEFAULT_BOUND_OFFSET;
      maxLat += VisualizationConsts.DEFAULT_BOUND_OFFSET;
      minLong -= VisualizationConsts.DEFAULT_BOUND_OFFSET;
      maxLong += VisualizationConsts.DEFAULT_BOUND_OFFSET;
    }
    const bounds = [
      [minLat, minLong],
      [maxLat, maxLong]
    ];
    return (
      <div>
        <Map bounds={bounds} className={styles.map}>
          <TileLayer
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
          {markers}
        </Map>
      </div>
    );
  }
}

export default GeoVisualization;
