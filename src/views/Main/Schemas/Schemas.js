import React, { PropTypes } from 'react';
import styles from './styles.module.css';
import { SchemaList } from './Components/SchemaList';
import { EntityTypeList } from './Components/EntityTypeList';
import { PropertyTypeList } from './Components/PropertyTypeList';
import { DataModelToolbar } from './Components/DataModelToolbar';
import EdmConsts from '../../../utils/Consts/EdmConsts';
import AuthService from '../../../utils/AuthService';
import '../../../core/styles/global/dropdown.css';

export class Schemas extends React.Component {

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

  getDataModelView() {
    const view = this.state.dataModelView;
    switch (view) {
      case EdmConsts.SCHEMA:
        return (<SchemaList />);
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
        <h2 className={styles.center}>Schemas</h2>
        <DataModelToolbar changeView={this.changeDataModelView} />
        <div className={styles.spacerBig} />
        {this.getDataModelView()}
      </div>
    );
  }
}

export default Schemas;
