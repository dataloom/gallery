import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Page from '../../components/page/Page';
import { EntitySetPropType } from '../edm/EdmModel';
import { getEdmObjectSilent } from '../edm/EdmStorage';
import EntitySetList from '../../components/entityset/EntitySetList';
import { popularEntitySetsRequest } from '../catalog/CatalogActionFactories';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';

class HomeComponent extends React.Component {
  static propTypes = {
    asyncState: AsyncStatePropType.isRequired,
    // Async props
    entitySets: PropTypes.arrayOf(EntitySetPropType),
    loadEntitySets: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.loadEntitySets();
  }

  // componentDidMount() {
  //   if (this.props.filterParams) {
  //     this.props.onSubmitSearch(this.props.filterParams);
  //   }
  // }

  renderPopularEntitySets = () => {
    if (this.props.entitySets !== undefined && this.props.entitySets.length > 0) {
      return (<AsyncContent
          {...this.props.asyncState}
          pendingContent={<h2>Please run a search</h2>}
          content={() => {
            return (<EntitySetList entitySets={this.props.entitySets} />);
          }} />);
    }
    return null;
  }

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Welcome to Loom!</Page.Title>
        </Page.Header>
        <Page.Body>
          {this.renderPopularEntitySets()}
        </Page.Body>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  const catalog = state.get('catalog').toJS();
  const normalizedData = state.get('normalizedData').toJS();

  const entitySets = catalog.popularEntitySetReferences.map((reference) => {
    return getEdmObjectSilent(normalizedData, reference, null);
  }).filter((entitySet) => {
    return entitySet;
  });

  return {
    asyncState: catalog.asyncState,
    entitySets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadEntitySets: () => {
      dispatch(popularEntitySetsRequest());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
