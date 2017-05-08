import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import Page from '../../../components/page/Page';
import styles from '../styles.module.css';
import { entitySetDetailRequest } from '../../entitysetdetail/EntitySetDetailActionFactories';

class TopUtilizersPage extends React.Component {
  static propTypes = {
    getEntitySetId: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired,
    entitySet: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  componentDidMount() {
    this.props.getEntitySetId();
  }

  renderEntitySetTitle = () => {
    return (
      <span>: <Link
          to={`/entitysets/${this.props.entitySet.get('id')}`}
          className={styles.titleLink}>{this.props.entitySet.get('title')}</Link></span>
    );
  }

  render() {
    return (
      <div>
        <Page.Header>
          <Page.Title>Top Utilizers{this.renderEntitySetTitle()}</Page.Title>
        </Page.Header>
        <Page.Body>
          {this.props.children}
        </Page.Body>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const entitySetDetail = state.get('entitySetDetail');

  return {
    entitySet: entitySetDetail.get('entitySet')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = {
    getEntitySetId: entitySetDetailRequest.bind(null, ownProps.params.id)
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersPage);
