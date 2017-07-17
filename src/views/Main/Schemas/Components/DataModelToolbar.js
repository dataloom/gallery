import React, { PropTypes } from 'react';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import styles from '../styles.module.css';

export class DataModelToolbar extends React.Component {
  static propTypes = {
    view: PropTypes.string,
    changeView: PropTypes.func.isRequired
  }

  dataModelLabels = [
    { label: 'Entity Types', type: EdmConsts.ENTITY_TYPE },
    { label: 'Association Types', type: EdmConsts.ASSOCIATION_TYPE },
    { label: 'Property Types', type: EdmConsts.PROPERTY_TYPE },
    { label: 'Schemas', type: EdmConsts.SCHEMA }
  ]

  updateViewAndToolbar(type) {
    this.props.changeView(type);
  }

  render() {
    const navButtons = this.dataModelLabels.map((labels) => {
      const label = labels.label;
      const type = labels.type;
      const view = this.props.view || EdmConsts.ENTITY_TYPE;

      let className = styles.buttonStyle;
      if (type === view) {
        className = `${styles.buttonStyle} ${styles.selectedButtonStyle}`;
      }
      if (this.dataModelLabels[0] === labels) {
        className = `${className} ${styles.firstEdmButton}`;
      }
      if (this.dataModelLabels[this.dataModelLabels.length - 1] === labels) {
        className = `${className} ${styles.lastEdmButton}`;
      }
      return (
        <button
            className={className}
            key={labels.type}
            onClick={() => {
              return this.updateViewAndToolbar(type);
            }}>{label}</button>
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
