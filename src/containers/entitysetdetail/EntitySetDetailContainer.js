/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Page from '../../components/page/Page';
import PageConsts from '../../utils/Consts/PageConsts';
import styles from './entitysetdetail.module.css';

import { fetchEntitySetProjectionRequest } from '../edm/EdmActionFactory';
import { getEntitySetsAuthorizations } from '../permissions/PermissionsActionFactory';
import { getEntitySetSizeRequest, entitySetDetailRequest } from './EntitySetDetailActionFactory';

class EntitySetDetailContainer extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      entitySetDetailRequest: PropTypes.func.isRequired,
      fetchEntitySetProjectionRequest: PropTypes.func.isRequired,
      getEntitySetsAuthorizations: PropTypes.func.isRequired,
      getEntitySetSizeRequest: PropTypes.func.isRequred
    }).isRequired,
    children: PropTypes.object.isRequired,
    entitySet: PropTypes.instanceOf(Immutable.Map).isRequired,
    entitySetId: PropTypes.string.isRequired
  }

  componentDidMount() {

    this.props.actions.entitySetDetailRequest(this.props.entitySetId);
    this.props.actions.getEntitySetSizeRequest(this.props.entitySetId);
    this.props.actions.getEntitySetsAuthorizations([this.props.entitySetId]);

    this.props.actions.fetchEntitySetProjectionRequest([{
      type: 'EntitySet',
      id: this.props.entitySetId,
      include: ['EntitySet', 'EntityType', 'PropertyTypeInEntitySet']
    }]);
  }

  getDocumentTitle = () => {
    return (!this.props.entitySet.isEmpty()) ? this.props.entitySet.get('title') : PageConsts.DEFAULT_DOCUMENT_TITLE;
  }

  render() {
    return (
      <DocumentTitle title={this.getDocumentTitle()}>
        <Page className={styles.page}>
          {this.props.children}
        </Page>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state :Map, ownProps :Object) :Object {

  const entitySetId :string = ownProps.params.id;
  const entitySet :Map = state.getIn(['edm', 'entitySets', entitySetId], Immutable.Map());

  return {
    entitySet,
    entitySetId
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    entitySetDetailRequest,
    fetchEntitySetProjectionRequest,
    getEntitySetsAuthorizations,
    getEntitySetSizeRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetDetailContainer);
