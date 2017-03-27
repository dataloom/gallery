import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { GeoVisualization } from './GeoVisualization';
import styles from './styles.module.css';

export class GeoContainer extends React.Component {

  static propTypes = {
    geoProps: PropTypes.instanceOf(Immutable.List),
    data: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.state = {
      mapProp: (props.geoProps.size) ? props.geoProps.get(0) : undefined
    };
  }

  handlePropChange = (e) => {
    const mapProp = (e) ? JSON.parse(e.value) : undefined;
    this.setState({ mapProp })
  }

  renderVisualizationChart = () => {
    if (!this.state.mapProp) return null;
    return <GeoVisualization data={this.props.data} mapProp={Immutable.Map(this.state.mapProp)} />;
  }

  render() {
    const { geoProps, data } = this.props;
    const mapProp = this.state.mapProp;
    if (geoProps.size < 1) return null;
    const options = [];
    geoProps.forEach((prop) => {
      if (prop.latProp) {
        if (mapProp && mapProp.latProp) return;
        options.push({
          label: 'Latitude/Longitude',
          value: JSON.stringify({
            latProp: prop.latProp.toJSON(),
            longProp: prop.longProp.toJSON()
          })
        });
      }
      else options.push({ label: prop.get('title'), value: JSON.stringify(prop.toJSON()) });
    });
    return (
      <div>
        <div className={styles.spacerSmall} />
        <div className={styles.inlineBlock}>
          {this.renderVisualizationChart()}
        </div>
        <div className={styles.spacerSmall} />
        <div className={styles.inlineBlock}>
          <div className={styles.xAxisSelectWrapper}>
            <div className={styles.selectButton}>
              <Select
                  placeholder="Choose a map to render"
                  options={options}
                  value={JSON.stringify(mapProp)}
                  onChange={this.handlePropChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GeoContainer;
