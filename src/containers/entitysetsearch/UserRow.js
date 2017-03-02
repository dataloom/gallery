import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Table, Column, Cell } from 'fixed-data-table';
import PropertyTextCell from './PropertyTextCell';
import userProfileImg from '../../images/user-profile-icon.png';
import styles from './styles.module.css';

const TABLE_WIDTH = 1000;
const ROW_HEIGHT = 50;
const TABLE_OFFSET = 2;
const PROPERTY_COLUMN_WIDTH = 200;
const COLUMN_WIDTH = (TABLE_WIDTH - PROPERTY_COLUMN_WIDTH);
const HEADERS = ['Property', 'Data'];

export default class UserRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rowKeys: [],
      propertyIds: [],
      numRows: 1
    }
  }

  componentDidMount() {
    this.setObjectKeys()
      .then((res) => {
        return this.setPropertyIds(res);
      })
      .then((res) => {
        this.setNumRows(res);
      })
      .catch((err) => {console.log('Error:', err)});
  }

  setObjectKeys() {
    const { row } = this.props;
    const rowKeys = Object.keys(row);

    return new Promise((resolve, reject) => {
      this.setState({rowKeys}, () => {
        resolve(this.state.rowKeys);
        reject(new Error('Error setting rowKeys state.'));
      });
    });
  }

  setPropertyIds(keys) {
    const { propertyTypes, firstName, lastName, dob } = this.props;

    const propertyIds = keys.filter((id) => {
      if (dob && id === dob.id) return false;
      return (id !== firstName.id && id !== lastName.id);
    });

    return new Promise((resolve, reject) => {
      this.setState({propertyIds}, () => {
        resolve(this.state.propertyIds);
        reject(new Error('Error setting propertyIds state.'));
      });
    });
  }

  setNumRows(propertyIds) {
    this.setState({numRows: propertyIds.length});
  }

  renderTable = () => {
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
    const header = HEADERS[0];
    const propertyTitles = this.getPropertyTitles();

    return (
      <Column
        key={0}
        header={header}
        cell={
          <PropertyTextCell data={propertyTitles} />
        }
        width={PROPERTY_COLUMN_WIDTH}
      />
    )
  }

  renderDataColumn() {
    const header = HEADERS[1];
    const cellData = this.getCellData();

    return (
      <Column
          key={1}
          header={<Cell>{header}</Cell>}
          cell={
            <PropertyTextCell data={cellData} />
          }
          width={COLUMN_WIDTH} />
    );
  }

  getPropertyTitles() {
    const { propertyTypes } = this.props;
    const { propertyIds } = this.state;

    var headers = propertyIds.map((id) => {
      var property = propertyTypes.filter((propertyType) => {
        return propertyType.id === id;
      });
      return property[0].title;
    });

    return headers;
  }

  getCellData(){
    const { row, propertyTypes, firstName, lastName, dob } = this.props;
    const { propertyIds } = this.state;

    return propertyIds.map((id) => {
      var formatValue = this.props.formatValueFn([row][0][id]);
      return formatValue;
    });
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
}
