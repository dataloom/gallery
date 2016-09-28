import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import '../styles.module.css';
import { PropertyTypeList } from './PropertyTypeList';
import CatalogApi from '../../../../utils/CatalogApi';
import Consts from '../../../../utils/AppConsts';
import { EntityTypeFqnList } from './EntityTypeFqnList';

export class Schema extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    propertyTypes: PropTypes.string,
    entityTypeFqns: PropTypes.string
  }

  constructor() {
    super();
    this.downloadFile = this.downloadFile.bind(this);
  }

  downloadFile(datatype) {
    CatalogApi.downloadSchema(this.props.name, datatype, this.props.entityTypeFqns);
  }

  render() {
    const { name, namespace, propertyTypes, entityTypeFqns } = this.props;
    return (
      <div className={'edmContainer'}>
        <div className={'name'}>{name}</div>
        <div className={'descriptionLabel'}> (name)</div>
        <br />
        <div className={'subtitle'}>{namespace}</div>
        <div className={'descriptionLabel'}> (namespace)</div>
        <br />
        <div className={'spacerMed'} />
        <div className={'tableDescriptionLabel'}>Entity Types:</div>
        <EntityTypeFqnList entityTypeFqns={entityTypeFqns} />
        <br />
        <div className={'spacerMed'} />
        <div className={'tableDescriptionLabel'}>Property Types:</div>
        <PropertyTypeList propertyTypes={propertyTypes} />
        <br />
        <Button onClick={() => this.downloadFile(Consts.JSON)}>Download {name} as JSON</Button>
      </div>
    );
  }
}

export default Schema;
