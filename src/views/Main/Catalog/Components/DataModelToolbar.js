import React, { PropTypes } from 'react';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';

export class DataModelToolbar extends React.Component {
  static propTypes = {
    changeView: PropTypes.func
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataModelView: Consts.SCHEMA
    };
  }

  dataModelLabels =
    [
      { label: 'Schemas', type: Consts.SCHEMA, key: 0 },
      { label: 'Entity Sets', type: Consts.ENTITY_SET, key: 1 },
      { label: 'Entity Types', type: Consts.ENTITY_TYPE, key: 2 },
      { label: 'Property Types', type: Consts.PROPERTY_TYPE, key: 3 }
    ]

  updateViewAndToolbar(type) {
    this.props.changeView(type);
    this.setState({ dataModelView: type });
  }

  render() {
    const navButtons = this.dataModelLabels.map((labels) => {
      const label = labels.label;
      const type = labels.type;
      let className = styles.buttonStyle;
      if (type === this.state.dataModelView) {
        className = styles.selectedButtonStyle;
      }
      return (
        <button onClick={() => this.updateViewAndToolbar(type)} className={className} key={labels.key}>{label}</button>
      );
    });

    return (
      <div className={styles.edmNavbarContainer}>
        <div className={styles.edmNavbar}>
          {navButtons}
        </div>
      </div>
    );
  }
}

export default DataModelToolbar;
