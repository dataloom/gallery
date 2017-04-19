import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersForm from '../components/TopUtilizersForm';
import { allEntitySetsRequest } from '../../catalog/CatalogActionFactories';
import { getShallowEdmObjectSilent } from '../../edm/EdmStorage';

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
    this.props.allEntitySetsRequest();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entitySets.size === 0 && nextProps.entitySets.size > 0) {
      this.props.setEntitySets(nextProps.entitySets);
    }
  }

  handleClickAddParameter = (e) => {
    e.preventDefault();
    this.setState({ counter: ++this.state.counter});
    const rowData = this.state.rowData;
    rowData.push({ id: this.state.counter });
    this.setState({ rowData });
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.submitQuery();
    // hashHistory push results page
  }

  render() {
    return (
      <TopUtilizersForm
          handleClick={this.handleClickAddParameter}
          rowData={this.state.rowData}
          onSubmit={this.onSubmit} />
    );
  }
}

function mapStateToProps(state) {
  const topUtilizers = state.get('topUtilizers');
  const catalog = state.get('catalog');
  const normalizedData = state.get('normalizedData').toJS();

  let entitySets = [];
  if (catalog && catalog.get('allEntitySetReferences')) {
    entitySets = catalog.get('allEntitySetReferences').map((reference) => {
      return getShallowEdmObjectSilent(normalizedData, reference, null);
    }).filter((entitySet) => {
      return entitySet;
    });
  }

  return {
    entitySetId: topUtilizers.get('entitySetId'),
    entitySets
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    allEntitySetsRequest,
    setEntitySets: actionFactory.setEntitySets,
    submitQuery: actionFactory.submitTopUtilizersRequest
    // getEntitySets: actionFactory.getEntitySetsRequest,
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersFormContainer);
