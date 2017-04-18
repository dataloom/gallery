import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import EntityRow from './EntityRow';
import userProfileImg from '../../images/user-profile-icon.png';
import styles from './styles.module.css';

export default class UserRow extends React.Component {
  constructor(props) {
    super(props);
    const propertyIds = this.getPropertyIds();
    this.state = {
      propertyIds,
      numRows: propertyIds.length
    };
  }

  getPropertyIds() {
    const { firstName, lastName, dob, row } = this.props;
    const propertyIds = Object.keys(row).filter((id) => {
      if (dob && id === dob.id) return false;
      return (id !== firstName.id && id !== lastName.id);
    });
    return propertyIds;
  }

  selectUser = () => {
    if (this.props.userPage) return;
    this.props.selectUserFn(this.props.entityId, this.props.row, this.props.entitySetId, this.props.propertyTypes);
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
    const dobVal = this.props.row[this.props.dob.id] || '';
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

  renderRow = () => {
    if (!this.props.userPage) return null;
    const row = Object.assign({}, this.props.row);
    delete row[this.props.firstName.id];
    delete row[this.props.lastName.id];
    if (this.props.dob) delete row[this.props.dob.id];
    return (
      <EntityRow
          row={row}
          entityId={this.props.entityId}
          entitySetId={this.props.entitySetId}
          formatValueFn={this.props.formatValueFn}
          propertyTypes={this.props.propertyTypes}
          onClick={this.props.onClick} />
    );
  }

  render() {
    return (
      <div className={this.getContainerClassName()}>
        {this.renderBackButton()}
        {this.renderUserProfile()}
        {this.renderRow()}
      </div>
    );
  }

  static propTypes = {
    row: PropTypes.object.isRequired,
    entitySetId: PropTypes.string.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    firstName: PropTypes.object.isRequired,
    lastName: PropTypes.object.isRequired,
    dob: PropTypes.object,
    selectUserFn: PropTypes.func,
    backFn: PropTypes.func,
    userPage: PropTypes.bool,
    formatValueFn: PropTypes.func,
    entityId: PropTypes.string,
    onClick: PropTypes.func.isRequired
  }
}
