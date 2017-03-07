import React, { PropTypes } from 'react';
// import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
// import BSTable from 'react-bootstrap-table';
var ReactBsTable  = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

export default class SampleBootstrapTable extends React.Component {
  constructor(props) {
    super(props);
  }

  isExpandableRow(row) {
    console.log('expandable called');
    if (row.id < 2) return true;
    else return false;
  }

  expandComponent(row) {
    console.log('expand called');

    return (
      <BSTable data={ row.expand } />
    );
  }

  render() {
    const options = {
      expandRowBgColor: 'rgb(242, 255, 163)'
    };

    return(
      <BootstrapTable
        data={this.state.users}
        scrollTop={'Top'}
        options={options}
        expandableRow={ this.isExpandableRow }
        expandComponent={ this.expandComponent }
        striped
        hover>
        <TableHeaderColumn width='200' dataField='email' isKey>Emails</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='roles'>Roles</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='entityPermissions'>Entity Permissions</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='propertyAPermissions'>Property A Permissions</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='propertyBPermissions'>Property B Permissions</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='propertyAPermissions'>Property A Permissions</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='propertyBPermissions'>Property B Permissions</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='propertyAPermissions'>Property A Permissions</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='propertyBPermissions'>Property B Permissions</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='propertyAPermissions'>Property A Permissions</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='propertyBPermissions'>Property B Permissions</TableHeaderColumn>
      </BootstrapTable>
    );
  }

}
