import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import '../styles.module.css';
import CatalogApi from '../../../../utils/CatalogApi';
import Consts from '../../../../utils/AppConsts';

export class EntitySet extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    typename: PropTypes.string
  }

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.displayError = this.displayError.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.state = {
      error: Consts.ERROR_STATE.hide,
      disableJson: false,
      disableCsv: false
    };
  }

  handleClick(datatype) {
    this.downloadFile(datatype);
    if (datatype === Consts.JSON) {
      this.setState({ disableJson: true });
    }
    else {
      this.setState({ disableCsv: true });
    }
  }

  downloadFile(datatype) {
    CatalogApi.downloadEntitySet(this.props.name, this.props.typename, datatype, this.displayError, this.enableButton);
  }

  displayError(datatype) {
    this.setState({ error: Consts.ERROR_STATE.show });
    this.enableButton(datatype);
  }

  enableButton(datatype) {
    if (datatype === Consts.JSON) {
      this.setState({ disableJson: false });
    }
    else {
      this.setState({ disableCsv: false });
    }
  }

  render() {
    const { name, title, typename } = this.props;
    return (
      <div className={'edmContainer'}>
        <div className={'name'}>{name}</div>
        <div className={'descriptionLabel'}> (name)</div>
        <br />
        <div className={'subtitle'}>{title}</div>
        <div className={'descriptionLabel'}> (title)</div>
        <br />
        <div className={'subtitle'}>{typename}</div>
        <div className={'descriptionLabel'}> (typename)</div>
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
          className={'spacerMargin'}
        >
          Download {name} as CSV
        </Button>
        <div className={this.state.error}>Unable to download {name}</div>
      </div>
    );
  }
}

export default EntitySet;
