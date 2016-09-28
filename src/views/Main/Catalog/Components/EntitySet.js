import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import '../styles.module.css';
import CatalogApi from '../../../../utils/CatalogApi';
import Consts from '../../../../utils/AppConsts';

export class EntitySet extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    typename: PropTypes.string
  }

  constructor() {
    super();
    this.downloadFile = this.downloadFile.bind(this);
    this.displayError = this.displayError.bind(this);
    this.state = {
      error: Consts.ERROR_STATE.hide
    };
  }

  downloadFile(datatype) {
    CatalogApi.downloadEntitySet(this.props.name, this.props.typename, datatype, this.displayError);
  }

  displayError() {
    this.setState({ error: Consts.ERROR_STATE.show });
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
        <Button onClick={() => this.downloadFile(Consts.JSON)}>Download {name} as JSON</Button>
        <Button onClick={() => this.downloadFile(Consts.CSV)} className={'spacerMargin'}>Download {name} as CSV</Button>
        <div className={this.state.error}>Unable to download {name}</div>
      </div>
    );
  }
}

export default EntitySet;
