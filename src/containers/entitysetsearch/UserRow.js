import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Table, Column, Cell } from 'fixed-data-table';
import UserTextCell from './UserTextCell';
import userProfileImg from '../../images/user-profile-icon.png';
import styles from './styles.module.css';

const TABLE_WIDTH = 1000;
const ROW_HEIGHT = 50;
const TABLE_OFFSET = 2;
const PROPERTY_COLUMN_WIDTH = 200;
const COLUMN_WIDTH = (TABLE_WIDTH - PROPERTY_COLUMN_WIDTH) / 2;
const HEADERS = ['PROPERTY', 'DATA'];

export default class UserRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numRows: 1
    }
  }

  componentDidMount() {
    const numRows = this.getPropertyIds().length;
    console.log('numRows:', numRows);
    this.setState({numRows});
  }

  static propTypes = {
    row: PropTypes.object.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    firstName: PropTypes.object.isRequired,
    lastName: PropTypes.object.isRequired,
    dob: PropTypes.object,
    selectUserFn: PropTypes.func,
    backFn: PropTypes.func,
    userPage: PropTypes.bool,
    formatValueFn: PropTypes.func
  }

  renderTable() {
    if (!this.props.userPage) return null;
    const tableHeight = ((this.state.numRows + 1) * ROW_HEIGHT) + TABLE_OFFSET;
    return (
      <Table
          rowsCount={this.state.numRows}
          rowHeight={ROW_HEIGHT}
          headerHeight={ROW_HEIGHT}
          width={TABLE_WIDTH}
          height={tableHeight}>
        {this.renderPropertyColumn()}
        {this.renderDataColumn()}
      </Table>
    );
  }

  renderPropertyColumn() {
    const { row, propertyTypes, firstName, lastName, dob } = this.props;
    const header = HEADERS[0];
    const propertyTitles = this.getPropertyTitles();
    const propertyTitle = propertyTitles[0];

    //TODO: how to handle rendering multiple cells in column?
    return (
      <Column
        key={0}
        header={header}
        cell={
          <UserTextCell data={propertyTitles[0]} formatValueFn={this.props.formatValueFn} />
        }
        width={PROPERTY_COLUMN_WIDTH}
      />
    )
  }

  renderDataColumn() {
    console.log('renderDataColumn');
    const { row, propertyTypes, firstName, lastName, dob } = this.props;
    const header = HEADERS[1];
    const data = this.getCellData();

    return (
      <Column
        key={1}
        header={header}
        cell={
          <UserTextCell data={'hey'} formatValueFn={this.props.formatValueFn} />
        }
        width={COLUMN_WIDTH}
      />
    );
  }

  getCellData() {
    const { row, propertyTypes, firstName, lastName, dob } = this.props;
    console.log('PROPERTY TYPES:', propertyTypes);
    const propertyIds = this.getPropertyIds();
    //TODO: Check what data value output is -> should be array of data
    const data = propertyIds.map((id) => {
      var dataContent = propertyTypes.filter((propertyType) => {
        return propertyType.id === id;
      });
      console.log('dataContent:', dataContent);
    })
  }

  getPropertyTitles() {
    const { propertyTypes } = this.props;
    var propertyIds = this.getPropertyIds();
    var headers = propertyIds.map((id) => {
      var property = propertyTypes.filter((propertyType) => {
        return propertyType.id === id;
      });
      var title = property[0].title;
      return title;
    });

    return headers;
  }

  getPropertyIds() {
    const { row, propertyTypes, firstName, lastName, dob } = this.props;

    const propertyIds = Object.keys(row).filter((id) => {
      if (dob && id === dob.id) return false;
      return (id !== firstName.id && id !== lastName.id);
    });
    // console.log('propertyIds:', propertyIds);
    return propertyIds;
  }





  selectUser = () => {
    if (this.props.userPage) return;
    this.props.selectUserFn(this.props.row);
  }

  renderBackButton = () => {
    if (!this.props.userPage) return null;
    return (
      <div>
        <Button onClick={this.props.backFn} bsStyle="primary" className={styles.backButton}>Back to results</Button>
        <br />
      </div>
    );
  }

  getFirstNameVal = () => {
    return this.props.formatValueFn(this.props.row[this.props.firstName.id]);
  }

  getLastNameVal = () => {
    return this.props.formatValueFn(this.props.row[this.props.lastName.id]);
  }

  renderDOB = () => {
    if (!this.props.dob) return null;
    const dobVal = this.props.row[this.props.dob.id];
    if (!dobVal) return null;
    return <div className={styles.userProfileDetailItem}><b>Date of Birth:</b> {this.props.formatValueFn(dobVal)}</div>;
  }

  getClassName = () => {
    return (this.props.userPage) ? styles.userProfile : styles.userListItem;
  }

  renderUserProfile = () => {
    return (
      <div className={this.getClassName()} onClick={this.selectUser}>
        <img src={userProfileImg} className={styles.userIcon} role="presentation" />
        <div className={styles.userProfileDetails}>
          <div className={styles.userProfileDetailItem}><b>First Name:</b> {this.getFirstNameVal()}</div>
          <div className={styles.userProfileDetailItem}><b>Last Name:</b> {this.getLastNameVal()}</div>
          {this.renderDOB()}
        </div>
      </div>
    );
  }

  getContainerClassName = () => {
    return (this.props.userPage) ? '' : styles.userListContainer;
  }

  render() {
    return (
      <div className={this.getContainerClassName()}>
        {this.renderBackButton()}
        {this.renderUserProfile()}
        {this.renderTable()}
      </div>
    );
  }
}
