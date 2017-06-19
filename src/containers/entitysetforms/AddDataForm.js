/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import moment from 'moment';
import PropTypes from 'prop-types';
import DatePicker from 'react-bootstrap-date-picker';

import { AuthorizationApi, DataApi } from 'loom-data';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

import EdmConsts from '../../utils/Consts/EdmConsts';
import { Permission } from '../../core/permissions/Permission';

import styles from './entitysetforms.module.css';

export default class AddDataForm extends React.Component {

  static propTypes = {
    entitySetId: PropTypes.string.isRequired,
    primaryKey: PropTypes.instanceOf(Immutable.List).isRequired,
    propertyTypes: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      authorizedPropertyTypes: [],
      propValues: {},
      loadAuthorizationsError: false,
      noPermissions: false,
      createSuccess: false,
      createFailure: false
    };
  }

  componentDidMount() {
    this.loadAuthorizedPropertyTypes();
  }

  loadAuthorizedPropertyTypes = () => {

    const accessChecks = [];
    this.props.propertyTypes.forEach((propertyType :Map) => {
      accessChecks.push({
        aclKey: [this.props.entitySetId, propertyType.get('id')],
        permissions: [Permission.WRITE.name]
      });
    });

    AuthorizationApi.checkAuthorizations(accessChecks)
    .then((response) => {
      const propValues = {};
      response.forEach((property) => {
        if (property.permissions.WRITE) {
          propValues[property.aclKey[1]] = [''];
        }
      });
      let canWrite = true;
      this.props.primaryKey.forEach((keyPropId) => {
        if (!Object.keys(propValues).includes(keyPropId)) {
          canWrite = false;
        }
      });
      if (!canWrite) {
        this.setState({ noPermissions: true });
      }
      else {
        const authorizedPropertyTypes = this.props.propertyTypes.filter((propertyType) => {
          return Object.keys(propValues).includes(propertyType.get('id'));
        });
        this.setState({ authorizedPropertyTypes, propValues });
      }
    }).catch(() => {
      this.setState({ loadAuthorizationsError: true });
    });
  }

  generateEntites = () => {
    const { propValues, authorizedPropertyTypes } = this.state;
    const localDateTimes = {};
    authorizedPropertyTypes.forEach((propertyType :Map) => {
      if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.get('datatype'))) {
        const propertyTypeId :string = propertyType.get('id');
        localDateTimes[propertyTypeId] = [moment(propValues[propertyTypeId]).format('YYYY-MM-DDThh:mm:ss')];
      }
    });
    const formattedValues = Object.assign({}, propValues, localDateTimes);
    const entityKey = this.props.primaryKey.map((keyId) => {
      const utf8Val = (formattedValues[keyId].length > 0) ? encodeURI(formattedValues[keyId][0]) : '';
      return btoa(utf8Val);
    }).join(',');
    return { [entityKey]: formattedValues };
  }

  onSubmit = (e) => {
    e.preventDefault();
    const entities = this.generateEntites();
    DataApi.createEntityData(this.props.entitySetId, '', entities)
    .then(() => {
      const propValues = {};
      this.state.authorizedPropertyTypes.forEach((propertyType :Map) => {
        propValues[propertyType.get('id')] = [''];
      });
      this.setState({
        createSuccess: true,
        createFailure: false,
        propValues
      });
    }).catch(() => {
      this.setState({
        createSuccess: false,
        createFailure: true
      });
    });
  }

  reset = () => {
    const propValues = {};
    this.state.authorizedPropertyTypes.forEach((propertyType :Map) => {
      propValues[propertyType.get('id')] = [''];
    });
    this.setState({
      propValues,
      loadAuthorizationsError: false,
      createSuccess: false,
      createFailure: false
    });
  }

  updatePropertyTypeValue = (propertyTypeId, newValue) => {
    const propValues = Object.assign({}, this.state.propValues, { [propertyTypeId]: [newValue] });
    this.setState({ propValues });
  }

  renderPropertyTypeInputs = () => {
    return this.state.authorizedPropertyTypes.map((propertyType :Map) => {
      let input = (<FormControl
          type="text"
          onChange={(e) => {
            this.updatePropertyTypeValue(propertyType.get('id'), e.target.value);
          }} />);
      if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.get('datatype'))) {
        const value = this.state.propValues[propertyType.get('id')][0];
        input = (
          <DatePicker
              id={`date-${propertyType.get('id')}`}
              value={value}
              showTodayButton
              onChange={(date) => {
                this.updatePropertyTypeValue(propertyType.get('id'), date);
              }} />);
      }
      return (
        <FormGroup key={propertyType.get('id')}>
          <ControlLabel>{propertyType.get('title')}</ControlLabel>
          {input}
        </FormGroup>
      );
    });
  }

  renderError = () => {
    if (!this.state.createError) return null;
    return (
      <div className={styles.error}>Error saving data</div>
    );
  }

  renderForm = () => {
    if (this.state.noPermissions || this.state.createSuccess) return null;
    return (
      <form onSubmit={this.onSubmit}>
        <div className={styles.addDataForm}>
          {this.renderPropertyTypeInputs()}
        </div>
        <div className={styles.formButton}>
          <Button type="submit" bsStyle="success">Add</Button>
        </div>
        {this.renderError()}
      </form>
    );
  }

  renderNoPermissions = () => {
    if (!this.state.noPermissions) return null;
    return (
      <div className={styles.error}>
        You do not have write permissions on the primary key property types of this entity set.
      </div>
    );
  }

  renderSuccess = () => {
    if (!this.state.createSuccess) return null;
    return (
      <div className={styles.centerContent}>
        <div className={styles.success}>Success!</div>
        <Button bsStyle="success" onClick={this.reset}>Create another</Button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderForm()}
        {this.renderNoPermissions()}
        {this.renderSuccess()}
      </div>
    );
  }
}
