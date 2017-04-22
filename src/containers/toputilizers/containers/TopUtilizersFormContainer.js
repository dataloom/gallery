import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hashHistory } from 'react-router';

import { getEdmObject, getShallowEdmObjectSilent } from '../../edm/EdmStorage';
import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersForm from '../components/TopUtilizersForm';
import TopUtilizersResultsContainer from './TopUtilizersResultsContainer';
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
      entitySets: [],
      showResultsTable: false
    };
  }

  componentDidMount() {
    this.props.getAllEntityTypesRequest();
    this.props.getAssociationsRequest();
  }

  componentWillReceiveProps(nextProps) {
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
    this.setState({ showResultsTable: true });
    // hashHistory.push(`entitysets/${this.props.entitySetId}/toputilizers/results`);
  }

  renderResultsContainer = () => {
    if (!this.state.showResultsTable) return null;
    return <TopUtilizersResultsContainer />;
  }

  render() {
    return (
      <div>
        <TopUtilizersForm
            handleClick={this.handleClickAddParameter}
            rowData={this.state.rowData}
            onSubmit={this.onSubmit}
            entitySetId={this.props.entitySetId} />
        <br />
        {this.renderResultsContainer()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const topUtilizers = state.get('topUtilizers');
  const catalog = state.get('catalog');
  const normalizedData = state.get('normalizedData').toJS();
  const entitySetDetail = state.get('entitySetDetail');

  let entitySet;
  const reference = entitySetDetail.get('entitySetReference');
  if (reference) {
    entitySet = getEdmObject(normalizedData, reference.toJS());
  }

  return {
    entitySetId: topUtilizers.get('entitySetId'),
    entitySet
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    getAllEntityTypesRequest: actionFactory.getAllEntityTypesRequest,
    getAssociationsRequest: actionFactory.getAssociationsRequest,
    submitQuery: actionFactory.submitTopUtilizersRequest,
    setEntitySet: actionFactory.setEntitySet
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersFormContainer);