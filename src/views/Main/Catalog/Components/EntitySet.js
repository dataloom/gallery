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
      error: Consts.HIDDEN,
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
    DataApi.getAllEntitiesOfTypeInSet(this.props.type, this.props.name)
    .then(data => FileService.saveFile(data, this.props.name, datatype, this.enableButton))
    .catch(() => this.displayError());
  }

  displayError = (datatype) => {
    this.setState({ error: Consts.ERROR });
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
      <div className={'edmContainer'}>
        <div className={'name'}>{name}</div>
        <div className={'descriptionLabel'}> (name)</div>
        <br />
        <div className={'subtitle'}>{title}</div>
        <div className={'descriptionLabel'}> (title)</div>
        <div className={'spacerSmall'} />
        <div className={'tableDescriptionLabel'}>Type:</div>
        <div>
          <table>
            <tbody>
              <tr>
                <th className={'tableCell'}>Name</th>
                <th className={'tableCell'}>Namespace</th>
              </tr>
              <tr className={'tableRows'}>
                <td className={'tableCell'}>{type.name}</td>
                <td className={'tableCell'}>{type.namespace}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={'spacerSmall'} />
        <Button
          onClick={() => this.handleClick(Consts.JSON)}
          disabled={this.state.disableJson}
        >
          Download {name} as JSON
        </Button>
        <Button
          onClick={() => this.handleClick(Consts.CSV)}
          disabled={this.state.disableCsv}
          className={'hidden'}
        >
          Download {name} as CSV
        </Button>
        <div className={this.state.error}>Unable to download {name}</div>
      </div>
    );
  }
}

export default EntitySet;
