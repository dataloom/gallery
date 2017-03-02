import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Table, Column, Cell } from 'fixed-data-table';
import TextCell from './TextCell';
import userProfileImg from '../../images/user-profile-icon.png';
import styles from './styles.module.css';

const TABLE_WIDTH = 1000;
const ROW_HEIGHT = 50;
const TABLE_OFFSET = 2;
const COLUMN_WIDTH = TABLE_WIDTH / 2;

export default class UserRow extends React.Component {

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
    // this.renderPropertyColumn();

    if (!this.props.userPage) return null;
    const tableHeight = (2 * ROW_HEIGHT) + TABLE_OFFSET;
    return (
      <Table
          rowsCount={1}
          rowHeight={ROW_HEIGHT}
          headerHeight={ROW_HEIGHT}
          width={TABLE_WIDTH}
          height={tableHeight}>
        {this.renderColumns()}
      </Table>
    );
  }

  renderColumns() {
    const { row, propertyTypes, firstName, lastName, dob } = this.props;
    const propertyIds = this.getPropertyIds();
    const propertyTitles = this.getPropertyTitles();
    const columnWidth = (TABLE_WIDTH - 1) / propertyIds.length;
    const headers = ['PROPERTY', 'DATA'];


    var columns = propertyIds.map((id, i) => {
      const title = propertyTitles[i];
      const header = headers[i];
      const propertyColumn = this.renderPropertyColumn(i, header);
      const dataColumn = this.renderDataColumn(i, header);

      return (
        <div key={i}>
        {propertyColumn}
        {dataColumn}
        </div>
      )
    });

    return columns;
  }

  renderPropertyColumn(i, header) {
    const propertyTitles = this.getPropertyTitles();
    const cells = propertyTitles.map((title) => {
      return (
        <TextCell content={title} formatValueFn={this.props.formatValueFn} />
      )
    });

    // how to handle rendering multiple cells in column?
    return (
      <Column
        key={i}
        header={header}
        cell={
          <TextCell content={propertyTitles[0]} formatValueFn={this.props.formatValueFn} />
        }
        width={COLUMN_WIDTH}
      />
    )
  }

  renderDataColumn(i, header) {

    return (
      <Column
        key={i}
        header={header}
        cell={
          <TextCell content={'hey'} formatValueFn={this.props.formatValueFn} />
        }
        width={COLUMN_WIDTH}
      />
    );
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
