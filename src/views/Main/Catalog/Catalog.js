import React from 'react';
import styles from './styles.module.css';
import { SchemaList } from './Components/SchemaList';
import { EntityTypeList } from './Components/EntityTypeList';
import { EntitySetList } from './Components/EntitySetList';
import { PropertyTypeList } from './Components/PropertyTypeList';
import { DataModelToolbar } from './Components/DataModelToolbar';
import Consts from '../../../utils/AppConsts';
import '../../../styles/dropdown.css';

export class Catalog extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataModelView: Consts.SCHEMA
    };
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
        return (<PropertyTypeList navBar />);
      default:
        return (<SchemaList />);
    }
  }

  changeDataModelView = (newView) => {
    this.setState({ dataModelView: newView });
  }

  render() {
    return (
      <div>
        <h2 className={styles.center}>Catalog</h2>
        <DataModelToolbar changeView={this.changeDataModelView} />
        <div className={styles.spacerBig} />
        {this.getDataModelView()}
      </div>
    );
  }
}

export default Catalog;
