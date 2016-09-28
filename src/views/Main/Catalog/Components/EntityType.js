import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { PropertyList } from './PropertyList';
import '../styles.module.css';
import CatalogApi from '../../../../utils/CatalogApi';
import Consts from '../../../../utils/AppConsts';

export class EntityType extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    properties: PropTypes.string,
    primaryKey: PropTypes.string
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
    CatalogApi.downloadEntityType(this.props.namespace, this.props.name, datatype, this.displayError);
  }

  displayError() {
    this.setState({ error: Consts.ERROR_STATE.show });
  }

  render() {
    const { name, namespace, properties, primaryKey } = this.props;
    return (
      <div className={'edmContainer'}>
        <div className={'name'}>{name}</div>
        <div className={'descriptionLabel'}> (name)</div>
        <br />
        <div className={'subtitle'}>{namespace}</div>
        <div className={'descriptionLabel'}> (namespace)</div>
        <br />
        <div className={'spacerMed'} />
        <div className={'tableDescriptionLabel'}>Properties:</div>
        <PropertyList properties={properties} primaryKey={primaryKey} />
        <br />
        <Button onClick={() => this.downloadFile(Consts.JSON)}>Download {name} as JSON</Button>
        <Button onClick={() => this.downloadFile(Consts.CSV)} className={'spacerMargin'}>Download {name} as CSV</Button>
        <div className={this.state.error}>Unable to download {name}</div>
      </div>
    );
  }
}

export default EntityType;
