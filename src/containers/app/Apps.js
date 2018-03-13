import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import DocumentTitle from 'react-document-title';
import FontAwesome from 'react-fontawesome';
import { Button, ControlLabel, DropdownButton, Modal, FormControl, FormGroup, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled, {
  css
} from 'styled-components';

import CreateApp from './CreateApp';
import CreateAppType from './CreateAppType';
import Page from '../../components/page/Page';
import { fetchOrganizationsRequest } from '../organizations/actions/OrganizationsActionFactory';
import * as actionFactory from './AppActionFactory';
import styles from './app.module.css';

const AppSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
`;

const ButtonContainer = styled.div`
  display: inline;
`;

const AppContainer = styled.div`
  display: inline;
  margin-left: 10px;
`;

const AppTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const InstallHelperText = styled.div`
  font-size: 14px;
  margin-bottom: 7px;
`;

const InstallButtonWrapper = styled.div`
  margin-top: 15px;
  text-align: center;
`;

const OrganizationSelectionWrapper = styled.div`
  margin-bottom: 30px;
`;

const ModalBodyContainer = styled.div`
  text-align: center;
`;

const NoOrganizationsText = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
`;

const ErrorMessageWrapper = styled.div`
  text-align: center;
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  color: red;
`;

class Apps extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    apps: PropTypes.instanceOf(Immutable.List).isRequired,
    appTypes: PropTypes.instanceOf(Immutable.List).isRequired,
    errorMessage: PropTypes.string.isRequired,
    organizations: PropTypes.instanceOf(Immutable.Map).isRequired,
    getAppsRequest: PropTypes.func.isRequired,
    getAppTypesForAppTypeIdsRequest: PropTypes.func.isRequired,
    getOwnedOrganizations: PropTypes.func.isRequired,
    install: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      installing: null,
      prefix: '',
      org: '',
      isAppModalOpen: false,
      isAppTypeModalOpen: false
    };
  }

  componentDidMount() {
    this.props.getAppsRequest();
    this.props.getOwnedOrganizations();
    this.props.getAppTypesForAppTypeIdsRequest();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.organizations.size && nextProps.organizations.size) {
      this.setState({ org: nextProps.organizations.keySeq().get(0) });
    }
  }

  onAddApp = () => {
    console.log('Made it into the app event handler');
    this.setState({
      isAppModalOpen: true
    });
    // FORMAT FOR WHEN READY TO HANDLE EVENT
    // this.props.actions.createEntitySetReset();
    // this.setState({
    //   isModalOpen: true
    // });
  };

  onAddAppType = () => {
    console.log('Made it into the apptype event handler');
    this.setState({
      isAppTypeModalOpen: true
    });
    // FORMAT FOR WHEN READY TO HANDLE EVENT
    // this.props.actions.createEntitySetReset();
    // this.setState({
    //   isModalOpen: true
    // });
  };

  closeModal = () => {
    this.setState({
      isAppModalOpen: false,
      isAppTypeModalOpen: false
    });
  };

  // getDefaultContact = () => {
  //   const profile = this.props.auth.getProfile();
  //   let defaultContact = '';
  //   if (profile.given_name) defaultContact = defaultContact.concat(`${profile.given_name} `);
  //   if (profile.family_name) defaultContact = defaultContact.concat(`${profile.family_name} `);
  //   if (profile.email) defaultContact = defaultContact.concat(`<${profile.email}>`);
  //   return defaultContact;
  // }

  renderApps = () => {
    return this.props.apps.map((app) => {

      // // get all the app types for the app, I'm assuming this is returning an array of objects
      // const appTypes = AppApi.getAppTypesForAppTypeIds(app.get('appTypeIds'))

      // // for each app, display its name
      // for (i=0; i < appTypes.length; ++i) {
      //   <div>{appTypes[i].name}</div>
      // }

      return (
        <div key={app.get('name')}>
          <AppSectionContainer>
            <ButtonContainer>
              <Button
                  bsStyle="default"
                  onClick={() => {
                    this.setState({ installing: app });
                  }}>
                <FontAwesome name="plus" />
              </Button>
            </ButtonContainer>
            <AppContainer>
              <AppTitle>{app.get('title')}</AppTitle>
              <div>{app.get('description')}</div>
              <div>{app.get('appTypeIds')}</div>
            </AppContainer>
          </AppSectionContainer>
          <hr />
        </div>
      );
    });
  }

  renderOrganizationSection = () => {
    const orgOptions = this.props.organizations.map((organization) => {
      const id = organization.get('id');
      const title = organization.get('title');
      return (
        <MenuItem
            key={id}
            eventKey={id}
            onClick={() => {
              this.setState({ org: id });
            }}>
          {title}
        </MenuItem>
      );
    });
    const selectedOrg = this.props.organizations.get(this.state.org);
    const selectedOrgTitle = selectedOrg.get('title');
    return (
      <OrganizationSelectionWrapper>
        <InstallHelperText>Select which organization you would like to download this app for.</InstallHelperText>
        <DropdownButton title={selectedOrgTitle} id="organization_select">
          {orgOptions}
        </DropdownButton>
      </OrganizationSelectionWrapper>
    );
  }

  renderPrefixSection = () => {
    return (
      <FormGroup>
        <ControlLabel>Choose a unique prefix for the datasets that will be used for this app.</ControlLabel>
        <FormControl
          type="text"
          value={this.state.prefix}
          onChange={(e) => {
            this.setState({ prefix: e.target.value });
          }} />
      </FormGroup>
    );
  }

  closeInstallModal = () => {
    this.setState({
      installing: null,
      prefix: ''
    });
  }

  install = () => {
    const appId = this.state.installing.get('id');
    const organizationId = this.state.org;
    const prefix = this.state.prefix;
    this.props.install(appId, organizationId, prefix);
    this.closeInstallModal();
  }

  renderError = () => {
    const error = this.props.errorMessage;
    if (!error || !error.length) return null;
    return (
      <ErrorMessageWrapper>
        <ErrorMessage>{error}</ErrorMessage>
      </ErrorMessageWrapper>
    );
  }

  renderModalBody = () => {
    if (!this.props.organizations.size) {
      return (
        <ModalBodyContainer>
          <NoOrganizationsText>You must be an owner of an organization to install an app.</NoOrganizationsText>
          <Link to='orgs/new'>Create an organization</Link>
        </ModalBodyContainer>
      );
    }
    return (
      <ModalBodyContainer>
        {this.renderOrganizationSection()}
        {this.renderPrefixSection()}
        <InstallButtonWrapper>
          <Button bsStyle="primary" onClick={this.install}>Install</Button>
        </InstallButtonWrapper>
      </ModalBodyContainer>
    );
  }

  renderInstallModal = () => {
    const app = this.state.installing;
    if (!app) return null;
    return (
      <Modal
          show={!!app}
          onHide={this.closeInstallModal}>
        <Modal.Header closeButton>
          <Modal.Title>Install {app.get('title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderModalBody()}
        </Modal.Body>
      </Modal>
    );
  }

  render() {
    const { isAppModalOpen } = this.state;
    const { isAppTypeModalOpen } = this.state;

    return (
      <DocumentTitle title="Apps">
        <Page>
          <Page.Header>
            <Page.Title>Browse Apps</Page.Title>
            <Button bsStyle="primary" className={styles.control} onClick={this.onAddApp}>
              <FontAwesome name="plus-circle" size="lg" /> App
            </Button>
            <Button bsStyle="primary" className={styles.control} onClick={this.onAddAppType}>
              <FontAwesome name="plus-circle" size="lg" /> App Type
            </Button>
          </Page.Header>
          <Modal show={isAppModalOpen} onHide={this.closeModal} container={this}>
            <Modal.Header closeButton>
              <Modal.Title>Create an App</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CreateApp />
            </Modal.Body>
          </Modal>
          <Modal show={isAppTypeModalOpen} onHide={this.closeModal} container={this}>
            <Modal.Header closeButton>
              <Modal.Title>Create an App Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CreateAppType />
            </Modal.Body>
          </Modal>
          <Page.Body>
            {this.renderError()}
            {this.renderApps()}
            {this.renderInstallModal()}
          </Page.Body>
        </Page>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const apps = state.getIn(['app', 'apps'], Immutable.List());
  const errorMessage = state.getIn(['app', 'errorMessage'], '');
  // const appTypes = state.getIn([]);
  // const appTypes = state.getIn('appTypes')
  const organizations = state.getIn(['organizations', 'organizations'], Immutable.Map())
    .filter((organization) => {
      return organization.get('isOwner');
    });

  return { apps, errorMessage, organizations };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    getAppsRequest: () => {
      dispatch(actionFactory.getApps());
    },
    getAppTypesForAppTypeIds: () => {
      dispatch(actionFactory.getAppTypesForAppTypeIdsRequest());
    },
    getOwnedOrganizations: () => {
      dispatch(fetchOrganizationsRequest());
    },
    install: (appId, organizationId, prefix) => {
      dispatch(actionFactory.installAppRequest(appId, organizationId, prefix));
    }
  };

  return actions;
}

export default connect(mapStateToProps, mapDispatchToProps)(Apps);
