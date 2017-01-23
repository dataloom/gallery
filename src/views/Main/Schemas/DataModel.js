import React, { PropTypes } from 'react';
import Page from '../../../components/page/Page';
import { SchemaList } from './Components/SchemaList';
import { EntityTypeList } from './Components/EntityTypeList';
import { PropertyTypeList } from './Components/PropertyTypeList';
import { DataModelToolbar } from './Components/DataModelToolbar';
import EdmConsts from '../../../utils/Consts/EdmConsts';

export class DataModel extends React.Component {

  static propTypes = {
    updateTopbarFn: PropTypes.func
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
        return (<PropertyTypeList />);
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
      <Page>
        <Page.Header>
          <Page.Title>Data model</Page.Title>
          <DataModelToolbar changeView={this.changeDataModelView} />
        </Page.Header>
        <Page.Body>
          {this.getDataModelView()}
        </Page.Body>
      </Page>
    );
  }
}

export default DataModel;
