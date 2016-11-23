import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { Promise } from 'bluebird';
import { LineChartVisualization } from './LineChartVisualization';
import Utils from '../../../utils/Utils';
import styles from './styles.module.css';

export class Visualize extends React.Component {

  static propTypes = {
    location: PropTypes.object
  }

  constructor(props) {
    super(props);
    const query = props.location.query;
    this.state = {
      name: query.name,
      typeNamespace: query.typeNamespace,
      typeName: query.typeName,
      properties: []
    };
  }

  loadProperties = () => {
    EntityDataModelApi.getEntityType(Utils.getFqnObj(this.state.typeNamespace, this.state.typeName))
    .then((type) => {
      const allPropertiesAsync = type.properties.map((prop) => {
        return EntityDataModelApi.getPropertyType(prop);
      });
      Promise.all(allPropertiesAsync).then((properties) => {
        console.log(properties);
        this.setState({ properties });
      });
    });
  }

  componentDidMount() {
    this.loadProperties();
  }

  render() {
    return (
      <div>visualize!!!</div>
    );
  }
}

export default Visualize;
