import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import { EntitySetPropType, EntitySetNschema } from '../../components/entityset/EntitySetStorage';
import { EntitySetDetail } from '../../components/entityset/EntitySet';
import AsyncContent from '../../components/asynccontent/AsyncContent';
import * as actionFactories from './EntitySetDetailActionFactories';

class EntitySetDetailComponent extends React.Component {
  static propTypes = {
    asyncState: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      errorMessage: PropTypes.string
    }).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }),
    entitySet: EntitySetPropType,
    requestEntitySet: PropTypes.func.isRequired
  };

  render() {
    return (
      <AsyncContent {...this.props.asyncState}>
        <EntitySetDetail {...this.props} />
      </AsyncContent>
    );
  }

  componentDidMount() {
    this.props.requestEntitySet(this.props.params.id);
  }
}

function mapStateToProps(state, ownProps) {
  const entitySetDetail = state.get('entitySetDetail').toJS(),
    normalizedData = state.get('normalizedData');

  const entitySetId = ownProps.params.id;
  let entitySet;
  if (normalizedData.hasIn(['entitySets'], entitySetId)) {
    entitySet = denormalize(entitySetId, EntitySetNschema, normalizedData.toJS());
  } else {
    entitySet = null;
  }

  return {
    asyncState: entitySetDetail.asyncState,
    entitySet
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestEntitySet: (id) => { dispatch(actionFactories.entitySetDetailRequest(id)); }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetDetailComponent);
