import React, { PropTypes } from 'react';
import EntityRow from './EntityRow';
import userProfileImg from '../../images/user-profile-icon.png';
import styles from './styles.module.css';

export default class UserRow extends React.Component {

  selectUser = () => {
    if (this.props.userPage) return;
    this.props.onClick(
      this.props.entityId,
      this.props.row,
      this.props.entitySetId,
      this.props.propertyTypes);
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

  renderMugshot = () => {
    let imgSrc = userProfileImg;
    if (this.props.mugshot) {
      const fqn = `${this.props.mugshot.type.namespace}.${this.props.mugshot.type.name}`;
      const mugshotList = this.props.row[fqn] || [];
      if (mugshotList.length > 0 && mugshotList[0].length > 0) imgSrc = `data:image/png;base64,${mugshotList[0]}`;
    }
    return <img src={imgSrc} className={styles.userIcon} role="presentation" />;
  }

  getFormattedVal = (prop) => {
    const value = this.props.row[`${prop.type.namespace}.${prop.type.name}`] || '';
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
        {this.renderMugshot()}
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
          entitySet={this.props.entitySet}
          formatValueFn={this.props.formatValueFn}
          propertyTypes={this.props.propertyTypes}
          onClick={this.props.onClick}
          jumpFn={this.props.jumpFn}
          backFn={this.props.backFn}
          breadcrumbs={this.props.breadcrumbs} />
    );
  }

  render() {
    return (
      <div className={this.getContainerClassName()}>
        {this.renderUserProfile()}
        {this.renderRow()}
      </div>
    );
  }

  static propTypes = {
    row: PropTypes.object.isRequired,
    entitySetId: PropTypes.string,
    entitySet: PropTypes.object,
    propertyTypes: PropTypes.array.isRequired,
    firstName: PropTypes.object.isRequired,
    lastName: PropTypes.object.isRequired,
    dob: PropTypes.object,
    mugshot: PropTypes.object,
    backFn: PropTypes.func,
    userPage: PropTypes.bool,
    formatValueFn: PropTypes.func,
    entityId: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    jumpFn: PropTypes.func,
    breadcrumbs: PropTypes.array
  }
}
