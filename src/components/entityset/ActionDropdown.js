import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { SplitButton, Button, MenuItem } from 'react-bootstrap';

import { DataApi } from 'loom-data';

import { EntitySetPropType } from './EntitySetStorage';
import FileConsts from '../../utils/Consts/FileConsts';
import PageConsts from '../../utils/Consts/PageConsts';

export default class ActionDropdown extends React.Component {
  static propTypes = {
    entitySet: EntitySetPropType.isRequired,
    showDetails: PropTypes.bool
  };

  render() {
    const { entitySet } = this.props;
    const type = entitySet.type;

    let details;
    if (this.props.showDetails) {
      details = (
        <li role="presentation">
          <Link to={`/entitysets/${this.props.entitySet.id}`}>
            View Details
          </Link>
        </li>
      );
    }

    return (
      <SplitButton pullRight title="Actions" id="action-dropdown">
        {details}
        <MenuItem header>Download</MenuItem>
        <MenuItem href={DataApi.getEntitySetDataFileUrl(entitySet.id, FileConsts.CSV)}>CSV</MenuItem>
        <MenuItem href={DataApi.getEntitySetDataFileUrl(entitySet.id, FileConsts.JSON)}>JSON</MenuItem>
        <MenuItem divider/>
        <li role="presentation">
          <Link
            to={{
              pathname: `/${PageConsts.VISUALIZE}`,
              query: {
                name: entitySet.name,
                typeNamespace: type.namespace,
                typeName: type.name
              }
            }}>
            Visualize
          </Link>
        </li>
      </SplitButton>
    );
  }
}