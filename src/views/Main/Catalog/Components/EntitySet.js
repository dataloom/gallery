import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { DataApi } from 'loom-data';
import Consts from '../../../../utils/AppConsts';
import FileService from '../../../../utils/FileService';
import styles from '../styles.module.css';

export class EntitySet extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      error: styles.hidden,
      disableJson: false,
      disableCsv: false
    };
  }

  handleClick = (datatype) => {
    this.downloadFile(datatype);
    if (datatype === Consts.JSON) {
      this.setState({ disableJson: true });
    }
    else {
      this.setState({ disableCsv: true });
    }
  }

  downloadFile = (datatype) => {
    DataApi.downloadAllEntitiesOfTypeInSet(this.props.type, this.props.name, datatype)
    .then(data => FileService.saveFile(data, this.props.name, datatype, () => this.enableButton(datatype)))
    .catch(() => this.displayError());
  }

  displayError = (datatype) => {
    this.setState({ error: styles.errorMsg });
    this.enableButton(datatype);
  }

  enableButton = (datatype) => {
    if (datatype === Consts.JSON) {
      this.setState({ disableJson: false });
    }
    else {
      this.setState({ disableCsv: false });
    }
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
        <Button
          onClick={() => this.handleClick(Consts.JSON)}
          disabled={this.state.disableJson}
        >
          Download {name} as JSON
        </Button>
        <Button
          onClick={() => this.handleClick(Consts.CSV)}
          disabled={this.state.disableCsv}
          className={styles.spacerMargin}
        >
          Download {name} as CSV
        </Button>
        <div className={this.state.error}>Unable to download {name}</div>
      </div>
    );
  }
}

export default EntitySet;
