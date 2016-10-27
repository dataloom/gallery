import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { DataApi } from 'loom-data';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';

export class EntitySet extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.object
  }

  getUrl = (datatype) => {
    return DataApi.getAllEntitiesOfTypeInSetUrl(this.props.type, this.props.name, datatype);
  }

  render() {
    const { name, title, type } = this.props;
    return (
      <div className={styles.edmContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.descriptionLabel}> (name)</div>
        <br />
        <div className={styles.subtitle}>{title}</div>
        <div className={styles.descriptionLabel}> (title)</div>
        <div className={styles.spacerSmall} />
        <div className={styles.tableDescriptionLabel}>Type:</div>
        <div>
          <table>
            <tbody>
              <tr>
                <th className={styles.tableCell}>Name</th>
                <th className={styles.tableCell}>Namespace</th>
              </tr>
              <tr className={styles.tableRows}>
                <td className={styles.tableCell}>{type.name}</td>
                <td className={styles.tableCell}>{type.namespace}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.spacerSmall} />
        <Button href={this.getUrl(Consts.JSON)}>
          Download {name} as JSON
        </Button>
        <Button href={this.getUrl(Consts.CSV)} className={styles.spacerMargin}>
          Download {name} as CSV
        </Button>
      </div>
    );
  }
}

export default EntitySet;
