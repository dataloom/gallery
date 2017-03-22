import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { loadEntitySet, getAllEntitySets } from './VisualizationActionFactories';
import AsyncContent from '../../components/asynccontent/AsyncContent';
import Page from '../../components/page/Page';
import { LineChartContainer } from './LineChartContainer';
import { ScatterChartContainer } from './ScatterChartContainer';
import { GeoContainer } from './GeoContainer';
import { EntitySetVisualizationList } from './EntitySetVisualizationList';
import VisualizationConsts from '../../utils/Consts/VisualizationConsts';
import styles from './styles.module.css';

class Visualize extends React.Component {

  static propTypes = {
    location: PropTypes.object,
    actions: PropTypes.shape({
      loadEntitySet: PropTypes.func.isRequired,
      getAllEntitySets: PropTypes.func.isRequired
    }).isRequired,
    entitySet: PropTypes.object,
    results: PropTypes.array,
    loadingDataStatus: PropTypes.symbol,
    errorMessage: PropTypes.string,
    numberProps: PropTypes.instanceOf(Immutable.List),
    dateProps: PropTypes.instanceOf(Immutable.List),
    geoProps: PropTypes.instanceOf(Immutable.List),
    chartOptions: PropTypes.instanceOf(Immutable.List),
    loadingVisualizableEntitySetsStatus: PropTypes.symbol,
    visualizableEntitySets: PropTypes.instanceOf(Immutable.List)
  }

  constructor(props) {
    super(props);
    this.state = {
      currentView: undefined
    };
  }

  componentDidMount() {
    if (this.props.location.query.setId) {
      this.props.actions.loadEntitySet(this.props.location.query.setId);
    }
    else this.props.actions.getAllEntitySets();
  }

  componentWillReceiveProps(nextProps) {
    const currentEntitySetId = this.props.location.query.setId;
    const nextEntitySetId = nextProps.location.query.setId;
    if (currentEntitySetId !== nextEntitySetId) {
      if (nextEntitySetId) {
        this.props.actions.loadEntitySet(nextEntitySetId);
      }
      else this.props.actions.getAllEntitySets();
    }
    if (!this.state.currentView && nextProps.chartOptions.size) {
      this.setState({ currentView: nextProps.chartOptions.get(0) });
    }
  }

  switchView = (newView) => {
    this.setState({
      currentView: newView
    });
  }

  getOptionButtonClass = (option) => {
    return (option === this.state.currentView) ? `${styles.optionButton} ${styles.selected}` : styles.optionButton;
  }

  renderViewOptions = () => {
    const options = this.props.chartOptions;
    if (options.size === 0) {
      return null;
    }
    const optionsBar = options.map((option) => {
      return (
        <button
            onClick={() => {
              this.switchView(option);
            }}
            className={this.getOptionButtonClass(option)}
            key={option}>{option}</button>
      );
    });
    return (
      <div className={styles.optionsBar}>
        {optionsBar}
      </div>
    );
  }

  renderVisualization = () => {
    const { results, numberProps, dateProps, geoProps } = this.props;
    switch (this.state.currentView) {
      case VisualizationConsts.SCATTER_CHART:
        return <ScatterChartContainer data={results} numberProps={numberProps} dateProps={dateProps} />;
      case VisualizationConsts.LINE_CHART:
        return <LineChartContainer data={results} numberProps={numberProps} dateProps={dateProps} />;
      case VisualizationConsts.MAP_CHART:
        return <GeoContainer data={results} geoProps={geoProps} />;
      default:
        return <div>There are no visualizations available for this entity set.</div>;
    }
  }

  renderVisualizationPage = () => {
    const title = this.props.entitySet ? (<Link
        to={`/entitysets/${this.props.entitySet.get('id')}`}
        className={styles.titleLink}>{this.props.entitySet.get('title')}</Link>) : '';
    return (
      <div>
        <Page.Header>
          <Page.Title>{title}</Page.Title>
          {this.renderViewOptions()}
        </Page.Header>
        <Page.Body>
          <AsyncContent
              status={this.props.loadingDataStatus}
              errorMessage={this.props.errorMessage}
              content={this.renderVisualization} />
        </Page.Body>
      </div>
    );
  }

  renderEntitySetVisualizationList = () => {
    return (
      <div>
        <Page.Header>
          <Page.Title>Choose an entity set to visualize</Page.Title>
        </Page.Header>
        <Page.Body>
          <AsyncContent
              status={this.props.loadingVisualizableEntitySetsStatus}
              errorMessage={this.props.errorMessage}
              content={() => {
                return (<EntitySetVisualizationList
                    visualizableEntitySets={this.props.visualizableEntitySets}
                    location={this.props.location} />);
              }} />
        </Page.Body>
      </div>
    );
  }

  render() {
    const entitySetId = this.props.location.query.setId;
    const content = (entitySetId) ? this.renderVisualizationPage() : this.renderEntitySetVisualizationList();
    return (
      <Page>
        {content}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    entitySet: state.getIn(['visualizations', 'entitySet']),
    results: state.getIn(['visualizations', 'results']),
    numberProps: state.getIn(['visualizations', 'numberProps']),
    dateProps: state.getIn(['visualizations', 'dateProps']),
    geoProps: state.getIn(['visualizations', 'geoProps']),
    chartOptions: state.getIn(['visualizations', 'chartOptions']),
    loadingDataStatus: state.getIn(['visualizations', 'loadingDataStatus']),
    loadingVisualizableEntitySetsStatus: state.getIn(['visualizations', 'loadingVisualizableEntitySetsStatus']),
    visualizableEntitySets: state.getIn(['visualizations', 'visualizableEntitySets']),
    errorMessage: state.getIn(['visualizations', 'errorMessage'])
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    loadEntitySet,
    getAllEntitySets
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Visualize);
