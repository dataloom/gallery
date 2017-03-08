import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import styles from '../styles.module.css';

class Header extends React.Component {
  render() {
    return(
      <tr>
        {headers}
      </tr>
    );
  }
}

class ProductRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.user.email}</td>
        <td>{this.props.user.role}</td>
        <td>{this.props.user.entityPermissions}</td>
        <td>{this.props.user.propertyAPermissions}</td>
        <td>{this.props.user.propertyBPermissions}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    var headers = [];
    this.props.headers.forEach((header, i) => {
      headers.push(<th key={i}>{header}</th>)
    });

    var rows = [];
    this.props.users.forEach(function(user) {
      rows.push(<ProductRow user={user} key={user.email} />);
    });

    return (
      <Table striped responsive>
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  }
}

class SearchBar extends React.Component {
  render() {
    return (
      <form>
        <input type="text" placeholder="Search..." />
      </form>
    );
  }
}


export default class ExpandableTable extends React.Component {
  render() {
    return(
      <div className='table'>
        <ProductTable users={this.props.users} headers={this.props.headers} />
      </div>
    )
  }
}
