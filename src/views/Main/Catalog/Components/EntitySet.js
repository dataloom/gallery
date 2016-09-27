import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import '../styles.module.css';
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
  }

  downloadFile(datatype) {
  //  CatalogApi.downloadEntitySetJson(this.props.namespace, this.props.name);
    return null;
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
      </div>
    );
  }
}

export default EntitySet;
