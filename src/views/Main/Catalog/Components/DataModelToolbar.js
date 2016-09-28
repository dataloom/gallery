import React, { PropTypes } from 'react';
import Consts from '../../../../utils/AppConsts';
import '../styles.module.css';

export class DataModelToolbar extends React.Component {
  static propTypes = {
    changeView: PropTypes.func
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataModelView: Consts.SCHEMAS
    };
  }

  dataModelLabels =
    [
      { label: 'Schemas', type: Consts.SCHEMAS, key: 0 },
      { label: 'Entity Sets', type: Consts.ENTITY_SET, key: 1 },
      { label: 'Entity Types', type: Consts.ENTITY_TYPE, key: 2 }
    ]

  buttonStyles = {
    unselected: 'buttonStyle',
    selected: 'selectedButtonStyle'
  }

  updateViewAndToolbar(type) {
    this.props.changeView(type);
    this.setState({ dataModelView: type });
  }

  render() {
    const navButtons = this.dataModelLabels.map((labels) => {
      const label = labels.label;
      const type = labels.type;
      let className = this.buttonStyles.unselected;
      if (type === this.state.dataModelView) {
        className = this.buttonStyles.selected;
      }
      return (
        <button onClick={() => this.updateViewAndToolbar(type)} className={className} key={labels.key}>{label}</button>
      );
    });

    return (
      <div className={'edmNavbarContainer'}>
        <div className={'edmNavbar'}>
          {navButtons}
        </div>
      </div>
    );
  }
}

export default DataModelToolbar;
