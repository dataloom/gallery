import React, { PropTypes } from 'react';
import styles from './styles.module.css';
import { SchemaList } from './Components/SchemaList';
import { EntityTypeList } from './Components/EntityTypeList';
import { EntitySetList } from './Components/EntitySetList';
import { PropertyTypeList } from './Components/PropertyTypeList';
import { DataModelToolbar } from './Components/DataModelToolbar';
import EdmConsts from '../../../utils/Consts/EdmConsts';
import AuthService from '../../../utils/AuthService';
import '../../../styles/dropdown.css';

export class Catalog extends React.Component {

  static propTypes = {
    auth: PropTypes.instanceOf(AuthService),
    updateTopbarFn: PropTypes.func,
    profileFn: PropTypes.func
  }

  static childContextTypes = {
    isAdmin: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataModelView: EdmConsts.SCHEMA
    };
  }

  componentDidMount() {
    this.props.updateTopbarFn();
  }

  getChildContext() {
    return {
      isAdmin: this.props.profileFn().isAdmin
    };
  }

  getDataModelView() {
    const view = this.state.dataModelView;
    switch (view) {
      case EdmConsts.SCHEMA:
        return (<SchemaList />);
      case EdmConsts.ENTITY_SET:
        return (<EntitySetList auth={this.props.auth} />);
      case EdmConsts.ENTITY_TYPE:
        return (<EntityTypeList />);
      case EdmConsts.PROPERTY_TYPE:
        return (<PropertyTypeList propertyTypePage />);
      default:
        return (<SchemaList />);
    }
  }

  changeDataModelView = (newView) => {
    this.props.updateTopbarFn();
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
