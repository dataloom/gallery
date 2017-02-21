import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Table, Column, Cell } from 'fixed-data-table';
import TextCell from './TextCell';
import userProfileImg from '../../images/user-profile-icon.png';
import styles from './styles.module.css';

const TABLE_WIDTH = 1000;
const ROW_HEIGHT = 50;
const TABLE_OFFSET = 2;

export default class UserRow extends React.Component {

  static propTypes = {
    row: PropTypes.object.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    firstName: PropTypes.object.isRequired,
    lastName: PropTypes.object.isRequired,
    dob: PropTypes.object,
    selectUserFn: PropTypes.func,
    backFn: PropTypes.func,
    userPage: PropTypes.bool
  }

  renderColumns = () => {
    const { row, propertyTypes, firstName, lastName, dob } = this.props;
    const propertyIds = Object.keys(row).filter((id) => {
      if (dob && id === dob.id) return false;
      return (id !== firstName.id && id !== lastName.id);
    });
    const columnWidth = TABLE_WIDTH / propertyIds.length;
    return propertyIds.map((id) => {
      const title = propertyTypes.filter((propertyType) => {
        return propertyType.id === id;
      })[0].title;
      return (
        <Column
            key={id}
            header={<Cell>{title}</Cell>}
            cell={
              <TextCell results={[row]} field={id} />
            }
            width={columnWidth} />
      );
    });
  }

  renderTable = () => {
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
    return this.props.row[this.props.firstName.id];
  }

  getLastNameVal = () => {
    return this.props.row[this.props.lastName.id];
  }

  renderDOB = () => {
    if (!this.props.dob) return null;
    const dobVal = this.props.row[this.props.dob.id];
    if (!dobVal) return null;
    return <div className={styles.userProfileDetailItem}><b>Date of Birth:</b> {dobVal}</div>;
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
