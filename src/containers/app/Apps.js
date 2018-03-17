import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import DocumentTitle from 'react-document-title';
import FontAwesome from 'react-fontawesome';
import { Button, ButtonGroup, ButtonToolbar, ControlLabel, DropdownButton, Modal, FormControl, FormGroup, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';
import { AppApi } from 'lattice';


import CreateApp from './CreateApp';
import EditApp from './EditApp';
import EditAppType from './EditAppType';
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

const AppDetails = styled.div`
  display: inline;
  margin-left: 10px;
`;

const AppSubSectionContainer = styled.div`
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
    // auth: PropTypes.object.isRequired,
    apps: PropTypes.instanceOf(Immutable.List).isRequired,
    appTypes: PropTypes.instanceOf(Immutable.Map).isRequired,
    errorMessage: PropTypes.string.isRequired,
    organizations: PropTypes.instanceOf(Immutable.Map).isRequired,
    getAppsRequest: PropTypes.func.isRequired,
    // getAppTypesForAppTypeIds: PropTypes.func.isRequired,
    deleteAppRequest: PropTypes.func.isRequired,
    deleteAppTypeFromAppRequest: PropTypes.func.isRequired,
    addAppTypeToAppRequest: PropTypes.func.isRequired,
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
      isAppTypeModalOpen: false,
      isEditAppModalOpen: false,
      isEditAppTypeModalOpen: false,
      addAppTypeAppId: '',
      addAppTypeAppTitle: '',
      addAppTypeAppTypeId: '',
      isAddAppTypeToAppModalOpen: false,
      editAppId: '',
      editAppTitle: '',
      editAppName: '',
      editAppDescription: '',
      editAppUrl: '',
      editAppTypeId: '',
      editAppTypeName: '',
      editAppTypeTitle: '',
      editAppTypeNamespace: '',
      editAppTypeEntityTypeId: '',
      editAppTypeDescription: ''
    };
  }

  componentDidMount() {
    this.props.getAppsRequest();
    this.props.getOwnedOrganizations();
    // this.props.getAppTypesForAppTypeIds();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.organizations.size && nextProps.organizations.size) {
      this.setState({ org: nextProps.organizations.keySeq().get(0) });
    }
  }

  onCreateApp = () => {
    this.setState({
      isAppModalOpen: true
    });
  };

  onDeleteApp = (app) => {
    this.props.deleteAppRequest(app.get('id'));
  };

  onDeleteAppTypeFromApp = (appId, appTypeId) => {
    this.props.deleteAppTypeFromAppRequest(appId, appTypeId);
  }

  onAddAppTypeToApp = () => {
    this.setState({
      isAddAppTypeToAppModalOpen: true
    });
  }

  renderAddAppForm = () => {
    return (
      <form onSubmit={() => {
        this.props.addAppTypeToAppRequest(this.state.addAppTypeAppId, this.state.addAppTypeAppTypeId);
        this.closeModal();
      }}>
        <FormGroup>
          <ControlLabel>Enter an App Type Id</ControlLabel>
          <FormControl type="text" onChange={(e) => {
            this.setState({ addAppTypeAppTypeId: e.target.value });
          }} />
        </FormGroup>
        <br />
        <Button type="submit" bsStyle="primary">Submit</Button>
      </form>
    );
  }

  onCreateAppType = () => {
    this.setState({
      isAppTypeModalOpen: true
    });
  };

  closeModal = () => {
    this.setState({
      isAppModalOpen: false,
      isAppTypeModalOpen: false,
      isAddAppTypeToAppModalOpen: false,
      isEditAppModalOpen: false,
      isEditAppTypeModalOpen: false
    });
  };

  getAppTypeIdByName = () => {
    // REFERENCE ONLY
    // for printing out an id for reference
    const appTypeIdFromApi = AppApi.getAppTypeByFqn('sixth', 'apptype');
    console.log(appTypeIdFromApi);
    return appTypeIdFromApi;
  }

  collectAppTypesFromApp = (app) => {
    // REMOVE THE FOLLOWING LINE WHEN DONE!
    // this.getAppTypeIdByName();
    const appTypeIdsFromApp = app.get('appTypeIds');
    const appTypesFromApp = [];

    for (let i = 0; i < appTypeIdsFromApp.size; i += 1) {
      appTypesFromApp.push(appTypeIdsFromApp.get(i));
    }
    return appTypesFromApp;
  }

  renderAppType = (app) => {
    // get the appTypeIds for the app
    // for each appTypeId lookup the appTypes
    const appTypeList = this.collectAppTypesFromApp(app);
    const appTypes = this.props.appTypes;
    const appNames = [];
    const { isEditAppTypeModalOpen } = this.state;

    if (appTypes.get(appTypeList[0])) {
      for (let i = 0; i < appTypeList.length; i += 1) {
        const eachApp = appTypes.get(appTypeList[i]);
        appNames.push(
          <AppSectionContainer key={eachApp.get('title')}>
            <ButtonContainer>
              <Button
                  bsStyle="default"
                  bsSize="xsmall"
                  onClick={() => {
                    this.onDeleteAppTypeFromApp(app.get('id'), eachApp.get('id'));
                  }}>
                <FontAwesome name="minus" />
              </Button>
            </ButtonContainer>
            <AppSubSectionContainer>
              <div>
                {eachApp.get('title')}
                &nbsp;
                &nbsp;
                <ButtonContainer>
                  <Button
                      bsStyle="default"
                      bsSize="small"
                      onClick={() => {
                        this.setState({ isEditAppTypeModalOpen: true });
                        this.setState({ editAppTypeId: eachApp.get('id') });
                        this.setState({ editAppTypeTitle: eachApp.get('title') });
                        this.setState({ editAppTypeName: eachApp.get('type').get('name') });
                        this.setState({ editAppTypeDescription: eachApp.get('description') });
                        this.setState({ editAppTypeNamespace: eachApp.get('type').get('namespace') });
                        this.setState({ editAppTypeEntityTypeId: eachApp.get('entityTypeId') });
                      }}>
                      Edit Metadata
                  </Button>
                </ButtonContainer>
              </div>
              <Modal show={isEditAppTypeModalOpen} onHide={this.closeModal} container={this}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit {this.state.editAppTypeTitle} Metadata</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <EditAppType
                      id={this.state.editAppTypeId}
                      name={this.state.editAppTypeName}
                      namespace={this.state.editAppTypeNamespace}
                      title={this.state.editAppTypeTitle}
                      description={this.state.editAppTypeDescription}
                      entityTypeId={this.state.editAppTypeEntityTypeId} />
                </Modal.Body>
              </Modal>
            </AppSubSectionContainer>
          </AppSectionContainer>);
      }
    }
    return (
      appNames
    );
  }

  renderApps = () => {
    return this.props.apps.map((app) => {

      const { isAddAppTypeToAppModalOpen } = this.state;
      const { isEditAppModalOpen } = this.state;

      return (
        <div key={app.get('name')}>
          <AppSectionContainer className={styles.appContainer}>
            <AppSectionContainer>
              <ButtonContainer>
                <ButtonToolbar>
                  <Button
                      bsStyle="default"
                      onClick={() => {
                        this.setState({ installing: app });
                      }}>
                    install
                  </Button>
                  <Button
                      bsStyle="default"
                      onClick={() => {
                        this.onDeleteApp(app);
                      }}>
                    delete
                  </Button>
                </ButtonToolbar>
              </ButtonContainer>
              <AppContainer>
                <AppTitle>{app.get('title')}</AppTitle>
                <div>{app.get('description')}</div>
                <AppSectionContainer>
                  <ButtonContainer>
                    <Button
                        bsStyle="default"
                        bsSize="xsmall"
                        onClick={() => {
                          this.onAddAppTypeToApp();
                          this.setState({
                            addAppTypeAppId: app.get('id'),
                            addAppTypeAppTitle: app.get('title')
                          });
                        }}>
                      <FontAwesome name="plus" />
                    </Button>
                  </ButtonContainer>
                  <AppSubSectionContainer>
                    <div>App Types:</div>
                  </AppSubSectionContainer>
                </AppSectionContainer>
                <Modal show={isAddAppTypeToAppModalOpen} onHide={this.closeModal} container={this}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add an App Type to {this.state.addAppTypeAppTitle}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {this.renderAddAppForm()}
                  </Modal.Body>
                </Modal>
                {this.renderAppType(app)}
              </AppContainer>
            </AppSectionContainer>
            <AppSubSectionContainer>
              <ButtonContainer>
                <Button
                    bsStyle="default"
                    bsSize="small"
                    onClick={() => {
                      this.setState({ isEditAppModalOpen: true });
                      this.setState({ editAppId: app.get('id') });
                      this.setState({ editAppTitle: app.get('title') });
                      this.setState({ editAppName: app.get('name') });
                      this.setState({ editAppDescription: app.get('description') });
                      this.setState({ editAppUrl: app.get('url') });
                    }}>
                    Edit Metadata
                </Button>
              </ButtonContainer>
              <Modal show={isEditAppModalOpen} onHide={this.closeModal} container={this}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit {this.state.editAppTitle} Metadata</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <EditApp
                      id={this.state.editAppId}
                      name={this.state.editAppName}
                      title={this.state.editAppTitle}
                      description={this.state.editAppDescription}
                      url={this.state.editAppUrl} />
                </Modal.Body>
              </Modal>
            </AppSubSectionContainer>
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
          <Link to="orgs/new">Create an organization</Link>
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
        <Page className={styles.apps}>
          <Page.Header className={styles.pageHeader}>
            <Page.Title className={styles.pageTitle}>Browse Apps</Page.Title>
            <ButtonContainer>
              <ButtonToolbar>
                <ButtonGroup>
                  <Button bsStyle="primary" className={styles.control} onClick={this.onCreateApp}>
                    <FontAwesome name="plus-circle" size="lg" /> App
                  </Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Button bsStyle="primary" className={styles.control} onClick={this.onCreateAppType}>
                    <FontAwesome name="plus-circle" size="lg" /> App Type
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
            </ButtonContainer>
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

function mapStateToProps(state) {
  const apps = state.getIn(['app', 'apps'], Immutable.List());
  const errorMessage = state.getIn(['app', 'errorMessage'], '');
  const appTypes = state.getIn(['app', 'appTypes'], Immutable.Map());
  const organizations = state.getIn(['organizations', 'organizations'], Immutable.Map())
    .filter((organization) => {
      return organization.get('isOwner');
    });

  return { apps, appTypes, errorMessage, organizations };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    getAppsRequest: () => {
      dispatch(actionFactory.getApps());
    },
    getAppTypesForAppTypeIds: (appTypeIds) => {
      dispatch(actionFactory.getAppTypesForAppTypeIdsRequest(appTypeIds));
    },
    getOwnedOrganizations: () => {
      dispatch(fetchOrganizationsRequest());
    },
    install: (appId, organizationId, prefix) => {
      dispatch(actionFactory.installAppRequest(appId, organizationId, prefix));
    },
    deleteAppRequest: (App) => {
      dispatch(actionFactory.deleteAppRequest(App));
    },
    deleteAppTypeFromAppRequest: (appId, appTypeId) => {
      dispatch(actionFactory.deleteAppTypeFromAppRequest(appId, appTypeId));
    },
    addAppTypeToAppRequest: (appId, appTypeId) => {
      dispatch(actionFactory.addAppTypeToAppRequest(appId, appTypeId));
    }
  };
  return actions;
}

export default connect(mapStateToProps, mapDispatchToProps)(Apps);
