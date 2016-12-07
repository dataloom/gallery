import React, { PropTypes } from 'react';
import { divIcon } from 'leaflet';
import { Map, Marker, TileLayer } from 'react-leaflet';
import styles from './styles.module.css';

export class GeoVisualization extends React.Component {

  static propTypes = {
    geoProps: PropTypes.array,
    data: PropTypes.array
  }

  render() {
    const { geoProps, data } = this.props;
    if (geoProps === undefined || geoProps[0] === undefined || geoProps[1] === undefined) return null;
    const icon = divIcon({ className: styles.divIcon });

    const latName = geoProps[0].name;
    const longName = geoProps[1].name;

    let maxLat = -90;
    let minLat = 90;
    let maxLong = -180;
    let minLong = 180;

    const markers = [];
    data.forEach((point) => {
      const lat = parseFloat(point[latName][0]);
      const long = parseFloat(point[longName][0]);
      if (isNaN(lat) || isNaN(long)) return;
      const position = [lat, long];
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (long < minLong) minLong = long;
      if (long > maxLong) maxLong = long;
      markers.push(<Marker position={position} icon={icon} key={data.indexOf(point)} />);
    });

    const bounds = [
      [minLat, minLong],
      [maxLat, maxLong]
    ];
    return (
      <div>
        <Map bounds={bounds} className={styles.map}>
          <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {markers}
        </Map>
      </div>
    );
  }
}

export default GeoVisualization;
