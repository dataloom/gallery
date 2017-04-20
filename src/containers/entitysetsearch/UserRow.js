import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import EntityRow from './EntityRow';
import userProfileImg from '../../images/user-profile-icon.png';
import styles from './styles.module.css';

export default class UserRow extends React.Component {

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
    return this.getFormattedVal(this.props.firstName);
  }

  getLastNameVal = () => {
    return this.getFormattedVal(this.props.lastName);
  }

  renderDOB = () => {
    if (!this.props.dob) return null;
    return (
      <div className={styles.userProfileDetailItem}>
        <b>Date of Birth:</b> {this.getFormattedVal(this.props.dob)}
      </div>);
  }

  getFormattedVal = (prop) => {
    const id = prop.id;
    const fqn = `${prop.type.namespace}.${prop.type.name}`;
    const value = this.props.row[id] || this.props.row[fqn] || '';
    return this.props.formatValueFn(value);
  }

  getRowWithoutUserProfile = () => {
    const row = Object.assign({}, this.props.row);
    delete row[this.props.firstName.id];
    delete row[`${this.props.firstName.type.namespace}.${this.props.firstName.type.name}`];
    delete row[this.props.lastName.id];
    delete row[`${this.props.lastName.type.namespace}.${this.props.lastName.type.name}`];
    if (this.props.dob) {
      delete row[this.props.dob.id];
      delete row[`${this.props.dob.type.namespace}.${this.props.dob.type.name}`];
    }
    return row;
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
    return (
      <EntityRow
          row={this.getRowWithoutUserProfile()}
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
