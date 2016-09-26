import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import Consts from '../../../../utils/AppConsts';

export class DataModelToolbar extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

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
      { label: 'Schemas', type: Consts.SCHEMAS },
      { label: 'Entity Sets', type: Consts.ENTITY_SET },
      { label: 'Entity Types', type: Consts.ENTITY_TYPE }
    ]

  buttonStyle =
    {
      display: 'table-cell',
      margin: '0',
      verticalAlign: 'middle',
      padding: '10',
      border: 'none'
    }

  selectedStyle =
    {
      display: 'table-cell',
      margin: '0',
      verticalAlign: 'middle',
      padding: '10',
      border: 'none',
      background: 'gray',
      fontWeight: 'bold'
    }

  updateViewAndToolbar(type) {
    this.props.changeView(type);
    this.setState({ dataModelView: type });
  }

  render() {
    const navButtons = this.dataModelLabels.map((labelPair) => {
      const label = labelPair.label;
      const type = labelPair.type;
      let style = this.buttonStyle;
      if (type === this.state.dataModelView) {
        style = this.selectedStyle;
      }
      return (
        <button onClick={() => this.updateViewAndToolbar(type)} style={style}>{label}</button>
      );
    });

    return (
      <div style={{ textAlign: 'center', paddingTop: '15' }}>
        <div style={{ height: '30', background: '#f6f6f6', display: 'inline-block', margin: '0 auto', textAlign: 'center' }}>
          {navButtons}
        </div>
      </div>
    );
  }
}

export default DataModelToolbar;
