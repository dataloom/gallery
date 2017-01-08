import React, { PropTypes } from 'react';
import { EntitySetList } from './components/EntitySetList';
import AuthService from '../../utils/AuthService';

export class CatalogComponent extends React.Component {
  static propTypes = {
    auth: PropTypes.instanceOf(AuthService)
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Catalog</h1>
        <EntitySetList auth={this.props.auth}/>
      </div>
    );
  }
}