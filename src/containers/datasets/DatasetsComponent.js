import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import Page from '../../components/page/Page';
import CreateEntitySet from '../entitysetforms/CreateEntitySet';
import styles from './datasets.module.css';

class DatasetsComponent extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    }
  }

  onAddDataset = () => {
    this.setState({
      isModalOpen: true
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false
    });
  };

  getDefaultContact = () => {
    console.log(this.props.auth.getProfile().email)
    return this.props.auth.getProfile().email || '';
  }

  render() {
    const { isModalOpen } = this.state;

    return (
      <Page className={styles.datasets}>
        <Page.Header className={styles.pageHeader}>
          <Page.Title className={styles.pageTitle}>Your datasets</Page.Title>
          <Button bsStyle="primary" className={styles.control} onClick={this.onAddDataset}>
            <FontAwesome name="plus-circle" size="lg"/> Dataset
          </Button>
        </Page.Header>

        <Modal show={isModalOpen} onHide={this.closeModal} container={this}>
          <Modal.Header closeButton>
            <Modal.Title>Create a dataset</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateEntitySet defaultContact={this.getDefaultContact()} />
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

export default connect(mapStateToProps, mapDispatchToProps)(DatasetsComponent);
