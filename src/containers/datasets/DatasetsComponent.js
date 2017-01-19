import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import Page from '../../components/page/Page';
import CreateEntitySet from '../entitysetforms/CreateEntitySet';
import styles from './datasets.module.css';

class DatasourcesComponent extends React.Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    }
  }

  onAddDatasource = () => {
    this.setState({
      isModalOpen: true
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false
    });
  };

  render() {
    const { isModalOpen } = this.state;

    return (
      <Page className={styles.datasources}>
        <Page.Header className={styles.pageHeader}>
          <Page.Title className={styles.pageTitle}>Your datasources</Page.Title>
          <Button bsStyle="primary" className={styles.control} onClick={this.onAddDatasource}>
            <FontAwesome name="plus-circle" size="lg"/> Datasource
          </Button>
        </Page.Header>

        <Modal show={isModalOpen} onHide={this.closeModal} container={this}>
          <Modal.Header closeButton>
            <Modal.Title>Create a datasource</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateEntitySet onCreate={this.props.onCreateEntityType} entityTypes={[]}/>
          </Modal.Body>
        </Modal>

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
    onCreateEntityType: () => {},
    loadEntityTypes: () => {}
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DatasourcesComponent);
