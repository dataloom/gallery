import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import * as actionFactory from './EntitySetDetailActionFactory';
import * as edmActionFactories from '../edm/EdmActionFactories';
import * as PermissionsActionFactory from '../permissions/PermissionsActionFactory';
import { getEdmObject } from '../edm/EdmStorage';
import Page from '../../components/page/Page';
import PageConsts from '../../utils/Consts/PageConsts';
import styles from './entitysetdetail.module.css';

class EntitySetDetailContainer extends React.Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    loadEntitySet: PropTypes.func.isRequired,
    entitySet: PropTypes.object,
    setEntitySet: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.loadEntitySet();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.entitySet && nextProps.entitySet) {
      this.props.setEntitySet(nextProps.entitySet);
    }
  }

  getDocumentTitle = () => {
    return (this.props.entitySet) ? this.props.entitySet.title : PageConsts.DEFAULT_DOCUMENT_TITLE;
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

function mapStateToProps(state) {
  const entitySetDetail = state.get('entitySetDetail');
  const normalizedData = state.get('normalizedData');

  let entitySet;
  const reference = entitySetDetail.get('entitySetReference');
  if (reference) {
    entitySet = getEdmObject(normalizedData.toJS(), reference.toJS());
  }

  return {
    entitySet
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { id } = ownProps.params;

  return {
    loadEntitySet: () => {
      dispatch(actionFactory.entitySetDetailRequest(id));
      dispatch(PermissionsActionFactory.getEntitySetsAuthorizations([id]));
      // TODO: Move filter creation in helper function in EdmApi
      dispatch(edmActionFactories.filteredEdmRequest(
        [{
          type: 'EntitySet',
          id,
          include: ['EntitySet', 'EntityType', 'PropertyTypeInEntitySet']
        }]
      ));
    },
    setEntitySet: (entitySet) => {
      dispatch(actionFactory.setEntitySet(entitySet));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetDetailContainer);
