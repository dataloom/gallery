import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hashHistory } from 'react-router';

import { getEdmObject, getShallowEdmObjectSilent } from '../../edm/EdmStorage';
import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersForm from '../components/TopUtilizersForm';
import { allEntitySetsRequest } from '../../catalog/CatalogActionFactories';

class TopUtilizersFormContainer extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.state= {
      counter: 0,
      rowData: [{id: 0}],
      entitySets: []
    };
  }

  componentDidMount() {
    this.props.getAllEntityTypesRequest();
    this.props.getAssociationsRequest();
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.entitySets.size === 0 && nextProps.entitySets.size > 0) {
    //   this.props.setEntitySets(nextProps.entitySets);
    // }

    if (!this.props.entitySet && nextProps.entitySet) {
      this.props.setEntitySet(nextProps.entitySet);
    }
  }

  handleClickAddParameter = (e) => {
    e.preventDefault();
    this.setState({ counter: ++this.state.counter});
    const rowData = this.state.rowData;
    if (this.state.counter <= 10) {
      rowData.push({ id: this.state.counter });
    }
    this.setState({ rowData });
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.submitQuery();
    hashHistory.push(`entitysets/${this.props.entitySetId}/toputilizers/results`);
  }

  render() {
    return (
      <TopUtilizersForm
          handleClick={this.handleClickAddParameter}
          rowData={this.state.rowData}
          onSubmit={this.onSubmit}
          entitySetId={this.props.entitySetId} />
    );
  }
}

function mapStateToProps(state) {
  const topUtilizers = state.get('topUtilizers');
  const catalog = state.get('catalog');
  const normalizedData = state.get('normalizedData').toJS();
  const entitySetDetail = state.get('entitySetDetail');

  let entitySets = [];
  if (catalog && catalog.get('allEntitySetReferences')) {
    entitySets = catalog.get('allEntitySetReferences').map((reference) => {
      return getShallowEdmObjectSilent(normalizedData, reference, null);
    }).filter((entitySet) => {
      return entitySet;
    });
  }

  let entitySet;
  const reference = entitySetDetail.get('entitySetReference');
  if (reference) {
    entitySet = getEdmObject(normalizedData, reference.toJS());
  }

  return {
    entitySetId: topUtilizers.get('entitySetId'),
    entitySets,
    entitySet
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    getAllEntityTypesRequest: actionFactory.getAllEntityTypesRequest,
    getAssociationsRequest: actionFactory.getAssociationsRequest,
    setEntitySets: actionFactory.setEntitySets,
    submitQuery: actionFactory.submitTopUtilizersRequest,
    setEntitySet: actionFactory.setEntitySet
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersFormContainer);
