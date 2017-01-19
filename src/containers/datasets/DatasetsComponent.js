import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Page from '../../components/page/Page';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import styles from './datasets.module.css';

class DatasourcesComponent extends React.Component {
  static propTypes = {

  };

  render() {
    return (
      <Page>
        <Page.Header className={styles.pageHeader}>
          <Page.Title className={styles.pageTitle}>Your datasources</Page.Title>
          <Button bsStyle="primary" className={styles.control}><FontAwesome name="plus-circle" size="lg"/> Datasource</Button>
        </Page.Header>
        <Page.Body>

        </Page.Body>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DatasourcesComponent);
