import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import DocumentTitle from 'react-document-title';
import FontAwesome from 'react-fontawesome';
import { Button, ButtonGroup, ButtonToolbar, ControlLabel, DropdownButton, FormControl, FormGroup, MenuItem, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';
import { AppApi, configure } from 'lattice';
import { bindActionCreators } from 'redux';

import CreateApp from './CreateApp';
import EditApp from './EditApp';
import EditAppType from './EditAppType';
import CreateAppType from './CreateAppType';
import Page from '../../components/page/Page';
import { fetchOrganizationsRequest } from '../organizations/actions/OrganizationsActionFactory';
import {
  addAppTypeToAppRequest,
  createAppReset,
  createAppTypeReset,
  deleteAppRequest,
  deleteAppTypeFromAppRequest,
  editAppReset,
  editAppTypeReset,
  getAppsRequest,
  installAppRequest
} from './AppActionFactory';
import styles from './app.module.css';

export const importApp = () => {
  const APP_NAME = 'BehavioralHealthReport';

  const PROD_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNvbG9tb25Ab3BlbmxhdHRpY2UuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVzZXJfbWV0YWRhdGEiOnt9LCJhcHBfbWV0YWRhdGEiOnsicm9sZXMiOlsiQXV0aGVudGljYXRlZFVzZXIiLCJhZG1pbiJdLCJvcmdhbml6YXRpb25zIjpbIjAwMDAwMDAwLTAwMDAtMDAwMS0wMDAwLTAwMDAwMDAwMDAwMCJdfSwibmlja25hbWUiOiJzb2xvbW9uIiwicm9sZXMiOlsiQXV0aGVudGljYXRlZFVzZXIiLCJhZG1pbiJdLCJ1c2VyX2lkIjoiZ29vZ2xlLW9hdXRoMnwxMTEyMTc5MDU3MjkxODczNzg3MzQiLCJpc3MiOiJodHRwczovL29wZW5sYXR0aWNlLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMTIxNzkwNTcyOTE4NzM3ODczNCIsImF1ZCI6Im84WTJVMnpiNUl3bzAxamR4TU4xVzJhaU44UHh3VmpoIiwiaWF0IjoxNTY3NjIzMjU0LCJleHAiOjE1Njc2NTkyNTR9.Dcq8myP7WWoWxrB-oJgxQdThZ18X2SbHXz7bQ8E6BwY';
  const LOCAL_JWT = localStorage.id_token;

  configure({ baseUrl: 'production', authToken: PROD_JWT });

  console.log('AppApi.getAppByName: ', AppApi.getAppByName(APP_NAME));
  AppApi.getAppByName(APP_NAME).then((app) => {
    delete app.category;

    const { appTypeIds } = app;
    AppApi.getAppTypesForAppTypeIds(appTypeIds).then((appTypesMap) => {
      const appTypes = Object.values(appTypesMap);
      console.log('appTypes: ', appTypes);
      appTypes.forEach((appType) => {
        delete appType.category;
      });

      configure({ baseUrl: 'localhost', authToken: LOCAL_JWT });

      Promise.all(appTypes.map(AppApi.createAppType)).then(() => {
        AppApi.createApp(app).then(() => {
          console.log('done');
        });
      });
    });
  });
};

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
    actions: PropTypes.shape({
      addAppTypeToAppRequest: PropTypes.func.isRequired,
      createAppReset: PropTypes.func.isRequired,
      createAppTypeReset: PropTypes.func.isRequired,
      deleteAppRequest: PropTypes.func.isRequired,
      deleteAppTypeFromAppRequest: PropTypes.func.isRequired,
      editAppReset: PropTypes.func.isRequired,
      editAppTypeReset: PropTypes.func.isRequired,
      fetchOrganizationsRequest: PropTypes.func.isRequired,
      getAppsRequest: PropTypes.func.isRequired,
      installAppRequest: PropTypes.func.isRequired
    }).isRequired,
    apps: PropTypes.instanceOf(Immutable.List).isRequired,
    appTypes: PropTypes.instanceOf(Immutable.Map).isRequired,
    errorMessage: PropTypes.string.isRequired,
    organizations: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      addAppTypeAppId: '',
      addAppTypeAppTitle: '',
      addAppTypeAppTypeId: '',
      editAppDescription: '',
      editAppId: '',
      editAppName: '',
      editAppTitle: '',
      editAppTypeDescription: '',
      editAppTypeEntityTypeId: '',
      editAppTypeId: '',
      editAppTypeName: '',
      editAppTypeNamespace: '',
      editAppTypeTitle: '',
      editAppUrl: '',
      installing: null,
      isAddAppTypeToAppModalOpen: false,
      isAppModalOpen: false,
      isAppTypeModalOpen: false,
      isEditAppModalOpen: false,
      isEditAppTypeModalOpen: false,
      isError: false,
      org: '',
      prefix: ''
    };
  }

  componentDidMount() {
    this.props.actions.getAppsRequest();
    this.props.actions.fetchOrganizationsRequest();

    // importApp();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.organizations.size && nextProps.organizations.size) {
      this.setState({ org: nextProps.organizations.keySeq().get(0) });
    }
  }

  onCreateApp = () => {
    this.props.actions.createAppReset();
    this.setState({
      isAppModalOpen: true
    });
  };

  onDeleteApp = (app) => {
    this.props.actions.deleteAppRequest(app.get('id'));
  };

  onDeleteAppTypeFromApp = (appId, appTypeId) => {
    this.props.actions.deleteAppTypeFromAppRequest(appId, appTypeId);
  }

  onAddAppTypeToApp = () => {
    this.setState({
      isAddAppTypeToAppModalOpen: true
    });
  }

  renderAddAppForm = () => {
    const { isError } = this.state;
    return (
      <form onSubmit={() => {
        if (!this.state.addAppTypeAppTypeId) {
          this.setState({
            isError: true
          });
          return;
        }
        this.props.actions.addAppTypeToAppRequest(this.state.addAppTypeAppId, this.state.addAppTypeAppTypeId);
        this.closeModal();
      }}>
        <FormGroup>
          <ControlLabel>Enter an App Type Id</ControlLabel>
          <FormControl type="text" onChange={(e) => {
            this.setState({ addAppTypeAppTypeId: e.target.value.trim() });
          }} />
        </FormGroup>
        <br />
        <Button type="submit" bsStyle="primary">Submit</Button>
        { isError ? (<div style={{ color: 'red' }} >
          <br />
          Please check your inputs
        </div>) : null}
      </form>
    );
  }

  onCreateAppType = () => {
    this.props.actions.createAppTypeReset();
    this.setState({
      isAppTypeModalOpen: true
    });
  };

  closeModal = () => {
    this.setState({
      isAddAppTypeToAppModalOpen: false,
      isAppModalOpen: false,
      isAppTypeModalOpen: false,
      isEditAppModalOpen: false,
      isEditAppTypeModalOpen: false
    });
  };

  getAppTypeIdByName = () => {
    // REFERENCE ONLY
    // for printing out an id for reference
    const appTypeIdFromApi = AppApi.getAppTypeByFqn({ namespace: 'sample', name: 'apptype' });
    return appTypeIdFromApi;
  }

  renderAppType = (app) => {
    // get the appTypeIds for the app
    // for each appTypeId lookup the app type in the appTypes map
    const appTypeIds = app.get('appTypeIds');
    const appTypes = this.props.appTypes;
    const appTypeElements = [];
    const { isEditAppTypeModalOpen } = this.state;


    if (!appTypes.isEmpty()) {
      for (let i = 0; i < appTypeIds.size; i += 1) {
        const eachApp = appTypes.get(appTypeIds.get(i));
        if (eachApp) {
          appTypeElements.push(
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
                          this.props.actions.editAppTypeReset();
                          this.setState({
                            editAppTypeDescription: eachApp.get('description'),
                            editAppTypeEntityTypeId: eachApp.get('entityTypeId'),
                            editAppTypeId: eachApp.get('id'),
                            editAppTypeName: eachApp.get('type').get('name'),
                            editAppTypeNamespace: eachApp.get('type').get('namespace'),
                            editAppTypeTitle: eachApp.get('title'),
                            isEditAppTypeModalOpen: true
                          });
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
                        description={this.state.editAppTypeDescription}
                        entityTypeId={this.state.editAppTypeEntityTypeId}
                        id={this.state.editAppTypeId}
                        name={this.state.editAppTypeName}
                        namespace={this.state.editAppTypeNamespace}
                        title={this.state.editAppTypeTitle} />
                  </Modal.Body>
                </Modal>
              </AppSubSectionContainer>
            </AppSectionContainer>);
        }
        else {
          console.warn('could not find app type', appTypeIds.get(i));
        }
      }
    }
    return (
      appTypeElements
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
                      this.props.actions.editAppReset();
                      this.setState({
                        editAppDescription: app.get('description'),
                        editAppId: app.get('id'),
                        editAppName: app.get('name'),
                        editAppTitle: app.get('title'),
                        editAppUrl: app.get('url'),
                        isEditAppModalOpen: true
                      });
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
                      description={this.state.editAppDescription}
                      id={this.state.editAppId}
                      name={this.state.editAppName}
                      title={this.state.editAppTitle}
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
            eventKey={id}
            key={id}
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
    this.props.actions.installAppRequest(appId, organizationId, prefix);
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
                  <Button bsStyle="primary" className={styles.control} onClick={importApp}>Import Apps</Button>
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
    addAppTypeToAppRequest,
    createAppReset,
    createAppTypeReset,
    deleteAppRequest,
    deleteAppTypeFromAppRequest,
    editAppReset,
    editAppTypeReset,
    fetchOrganizationsRequest,
    getAppsRequest,
    installAppRequest
  };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Apps);
