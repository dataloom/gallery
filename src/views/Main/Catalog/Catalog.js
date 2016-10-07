import React from 'react';
import './styles.module.css';
import { SchemaList } from './Components/SchemaList';
import { EntityTypeList } from './Components/EntityTypeList';
import { EntitySetList } from './Components/EntitySetList';
import { PropertyTypeList } from './Components/PropertyTypeList';
import { DataModelToolbar } from './Components/DataModelToolbar';
import Consts from '../../../utils/AppConsts';

export class Catalog extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataModelView: Consts.SCHEMA
    };
    this.changeDataModelView = this.changeDataModelView.bind(this);
  }

  getDataModelView() {
    const view = this.state.dataModelView;
    switch (view) {
      case Consts.SCHEMA:
        return (<SchemaList />);
      case Consts.ENTITY_SET:
        return (<EntitySetList />);
      case Consts.ENTITY_TYPE:
        return (<EntityTypeList />);
      case Consts.PROPERTY_TYPE:
        return (<PropertyTypeList />);
      default:
        return (<SchemaList />);
    }
  }

  changeDataModelView(newView) {
    this.setState({ dataModelView: newView });
  }

  render() {
    return (
      <div>
        <h2 className={'center'}>Catalog</h2>
        <DataModelToolbar changeView={this.changeDataModelView} />
        {this.getDataModelView()}
      </div>
    );
  }
}

export default Catalog;
