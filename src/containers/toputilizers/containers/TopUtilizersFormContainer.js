import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersForm from '../components/TopUtilizersForm';
import TopUtilizersResultsContainer from './TopUtilizersResultsContainer';

class TopUtilizersFormContainer extends React.Component {
  static propTypes = {
    getEntitySetRequest: PropTypes.func.isRequired,
    submitQuery: PropTypes.func.isRequired,
    entitySet: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      rowData: [{ id: 0 }],
      entitySets: [],
      showResultsTable: false
    };
  }

  componentDidMount() {
    this.props.getEntitySetRequest(this.props.params.id);
  }

  handleClickAddParameter = (e) => {
    e.preventDefault();
    this.setState({ counter: ++this.state.counter });
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
            entitySet={this.props.entitySet} />
        <br />
        {this.renderResultsContainer()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const topUtilizers = state.get('topUtilizers');

  return {
    entitySet: topUtilizers.get('entitySet')
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    getEntitySetRequest: actionFactory.getEntitySetRequest,
    submitQuery: actionFactory.submitTopUtilizersRequest
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersFormContainer);
