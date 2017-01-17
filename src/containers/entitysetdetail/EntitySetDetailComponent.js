import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import { EntitySetPropType, EntitySetNschema } from '../../components/entityset/EntitySetStorage';
import { EntitySetDetail } from '../../components/entityset/EntitySet';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import * as actionFactories from './EntitySetDetailActionFactories';

class EntitySetDetailComponent extends React.Component {
  static propTypes = {
    asyncState: AsyncStatePropType.isRequired,
    entitySet: EntitySetPropType,
    loadEntitySet: PropTypes.func.isRequired
  };

  render() {
    return (
      <AsyncContent {...this.props.asyncState} content={() => {
        return (<EntitySetDetail entitySet={this.props.entitySet} />);
      }}/>
    );
  }

  componentDidMount() {
    this.props.loadEntitySet();
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

function mapDispatchToProps(dispatch, ownProps) {
  return {
    loadEntitySet: () => { dispatch(actionFactories.entitySetDetailRequest(ownProps.params.id)); }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetDetailComponent);
