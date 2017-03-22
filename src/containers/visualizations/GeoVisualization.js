import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { divIcon } from 'leaflet';
import { Map, Marker, TileLayer } from 'react-leaflet';
import VisualizationConsts from '../../utils/Consts/VisualizationConsts';
import styles from './styles.module.css';

export class GeoVisualization extends React.Component {

  static propTypes = {
    geoProps: PropTypes.instanceOf(Immutable.List),
    data: PropTypes.array
  }

  render() {
    const { geoProps, data } = this.props;
    if (!geoProps || !geoProps.get(0) || !geoProps.get(1)) return null;
    const icon = divIcon({ className: styles.divIcon });
    const latFqn = `${geoProps.get(0).type.namespace}.${geoProps.get(0).type.name}`;
    const longFqn = `${geoProps.get(1).type.namespace}.${geoProps.get(1).type.name}`;

    let maxLat = -90;
    let minLat = 90;
    let maxLong = -180;
    let minLong = 180;

    const markers = [];
    data.forEach((point) => {
      const lat = parseFloat(point[latFqn][0]);
      const long = parseFloat(point[longFqn][0]);
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
