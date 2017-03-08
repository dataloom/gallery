import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn, TableColumn, ExpandComponent } from 'react-bootstrap-table';

export default class SampleBootstrapTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [{
        id: 0,
        email: 'corwin@thedataloom.com',
        role: 'all',
        entityPermissions: 'Read, Write, Discover, Link',
        propertyAPermissions: 'Read, Write',
        propertyBPermissions: '-',
        expand: [{
          role: 'admin',
          entityPermissions: 'Read, Write, Discover, Link',
          propertyAPermissions: 'Read, Write',
          propertyBPermissions: '-'
        }, {
          role: 'xyz',
          entityPermissions: 'Read, Write',
          propertyAPermissions: 'Read, Write',
          propertyBPermissions: 'Read, Write'
        }]
      }, {
        id: 1,
        email: 'matthew@thedataloom.com',
        role: 'all',
        entityPermissions: ['read', 'write'],
        propertyAPermissions: ['read'],
        propertyBPermissions: ['read'],
        expand: [{
          role: 'role',
          entityPermissions: ['read', 'write', 'discover', 'link'],
          propertyAPermissions: ['read', 'write'],
          propertyBPermissions: []
        }]
      }, {
        id: 2,
        email: 'katherine@thedataloom.com',
        role: 'all',
        entityPermissions: ['read'],
        propertyAPermissions: ['read'],
        propertyBPermissions: ['read'],
        expand: [{
          role: 'role',
          entityPermissions: ['read', 'write', 'discover', 'link'],
          propertyAPermissions: ['read', 'write'],
          propertyBPermissions: []
        }]
      }]
    }
  }

  isExpandableRow(row) {
    return true;
  }

  expandComponent(row) {
    return (
      <BootstrapTable
        data={row.expand}>
        <TableHeaderColumn width='180' dataField='email' isKey ></TableHeaderColumn>
        <TableHeaderColumn width='180' dataField='role'></TableHeaderColumn>
        <TableHeaderColumn width='180' dataField='entityPermissions'></TableHeaderColumn>
        <TableHeaderColumn width='180' dataField='propertyAPermissions'></TableHeaderColumn>
        <TableHeaderColumn width='180' dataField='propertyBPermissions'></TableHeaderColumn>
        <TableHeaderColumn width='180' dataField='propertyAPermissions'></TableHeaderColumn>
        <TableHeaderColumn width='180' dataField='propertyBPermissions'></TableHeaderColumn>
      </BootstrapTable>
    );
  }

  render() {
    const options = {
      expandRowBgColor: 'grey'
    };

    return(
      <BootstrapTable
        data={this.state.users}
        scrollTop={'Top'}
        options={options}
        expandableRow={ this.isExpandableRow }
        expandComponent={ this.expandComponent }
        width='1400'
        striped
        hover>
        <TableHeaderColumn width='200' dataField='email' isKey>Emails</TableHeaderColumn>
        <TableHeaderColumn width='180' dataField='role'>Roles</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='entityPermissions'>Entity Permissions</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='propertyAPermissions'>Property A Permissions</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='propertyBPermissions'>Property B Permissions</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='propertyAPermissions'>Property A Permissions</TableHeaderColumn>
        <TableHeaderColumn width='200' dataField='propertyBPermissions'>Property B Permissions</TableHeaderColumn>
      </BootstrapTable>
    );
  }

}
