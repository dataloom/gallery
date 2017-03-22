import React, { PropTypes } from 'react';
import { hashHistory } from 'react-router';
import styles from './styles.module.css';

export class EntitySetVisualizationList extends React.Component {

  static propTypes = {
    visualizableEntitySets: PropTypes.array,
    location: PropTypes.object
  }

  routeToEntitySet = (entitySetId) => {
    const query = { setId: entitySetId };
    const newLocation = Object.assign({}, this.props.location, { query });
    hashHistory.push(newLocation);
  }

  render() {
    const entitySetList = (this.props.visualizableEntitySets.length === 0) ?
      <p>You do not have access to any visualizable entity sets.</p> :
      this.props.visualizableEntitySets.map((entitySet) => {
        return (
          <button
              onClick={() => {
                this.routeToEntitySet(entitySet.id);
              }}
              className={styles.listItemButton}
              key={entitySet.id} >
            <div className={styles.entitySetTitle}>{entitySet.title}</div>
            <div className={styles.entitySetFqn}>{entitySet.description}</div>
          </button>
        );
      });
    return (<div>{entitySetList}</div>);
  }
}

export default EntitySetVisualizationList;
