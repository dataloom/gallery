import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import AuthService from '../../../utils/AuthService';
import styles from './styles.module.css';
import { SchemaList } from './Components/SchemaList';
import { EntityTypeList } from './Components/EntityTypeList';
import { EntitySetList } from './Components/EntitySetList';
import { DataModelToolbar } from './Components/DataModelToolbar';
import Consts from '../../../utils//AppConsts';

export class Catalog extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    auth: PropTypes.instanceOf(AuthService)
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataModelView: Consts.SCHEMA
    };
    this.logout = this.logout.bind(this);
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
      default:
        return (<SchemaList />);
    }
  }

  changeDataModelView(newView) {
    this.setState({ dataModelView: newView });
  }

  logout() {
    this.props.auth.logout();
    this.context.router.push('/login');
  }

  render() {
    return (
      <div className={styles.root}>
        <h2 style={{ textAlign: 'center' }}>Catalog</h2>
        <DataModelToolbar changeView={this.changeDataModelView} />
        {this.getDataModelView()}
        <Button onClick={this.logout} style={{ marginLeft: '50px' }}>Logout</Button>
      </div>
    );
  }
}

export default Catalog;
