import React, { PropTypes } from 'react';
import Reorder from 'react-reorder';

import ActionConsts from '../../../../utils/Consts/ActionConsts';
import styles from '../styles.module.css';

import {
  ReorderProperty
} from './ReorderProperty';

export class ReorderPropertyList extends React.Component {
  static propTypes = {
    properties: PropTypes.array.isRequired,
    reorderCallback: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      error: {
        display: styles.hidden,
        action: ActionConsts.ADD
      },
      selectedItem: undefined
    };
  }

  updateError = (action) => {
    this.setState({
      error: {
        display: styles.errorMsg,
        action
      },
      verifyingDelete: false
    });
  }

  itemClicked = (e, item) => {
    const selectedItem = (item === this.state.selectedItem) ? undefined : item;
    this.setState({ selectedItem });
  }

  render() {

    const { properties } = this.props;
    const propArray = (properties && properties.length > 0) ? properties : [];

    const propertyList = [];
    propArray.forEach((prop) => {
      if (prop) {
        propertyList.push(
          <div>{prop.title}</div>
        );
      }
    });

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th className={styles.tableCell}>Property Type Name</th>
              <th className={styles.tableCell}>Property Type Namespace</th>
              <th className={styles.tableCell}>Property Type Title</th>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <Reorder
                itemKey="id"
                holdTime="100"
                list={propArray}
                template={ReorderProperty}
                callback={this.props.reorderCallback}
                itemClass={styles.listItem} />
          </tbody>
        </table>
      </div>
    );
  }
}

export default ReorderPropertyList;
