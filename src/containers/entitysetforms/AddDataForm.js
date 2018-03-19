import React from 'react';

import Immutable from 'immutable';
import moment from 'moment';
import PropTypes from 'prop-types';
import DatePicker from 'react-bootstrap-date-picker';

import { AuthorizationApi, DataApi } from 'lattice';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

import EdmConsts from '../../utils/Consts/EdmConsts';
import { Permission } from '../../core/permissions/Permission';

import styles from './entitysetforms.module.css';

export default class AddDataForm extends React.Component {

  static propTypes = {
    entitySetId: PropTypes.string.isRequired,
    primaryKey: PropTypes.instanceOf(Immutable.List).isRequired,
    propertyTypes: PropTypes.instanceOf(Immutable.List).isRequired,
    entitySetPropertyMetadata: PropTypes.instanceOf(Immutable.Map).isRequired
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
    this.props.propertyTypes.forEach((propertyType) => {
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

  getEntityId = (primaryKeyIds, formattedValues) => {
    const pKeyVals = [];
    primaryKeyIds.forEach((pKey) => {
      const rawValues = formattedValues[pKey] || [];
      const encodedValues = [];
      rawValues.forEach((value) => {
        encodedValues.push(btoa(value));
      });
      pKeyVals.push(btoa(encodeURI(encodedValues.join(','))));
    });
    return pKeyVals.join(',');
  }

  generateEntites = () => {
    const { propValues, authorizedPropertyTypes } = this.state;
    const formattedValues = {};
    authorizedPropertyTypes.forEach((propertyType) => {
      const propertyTypeId = propertyType.get('id');
      if (propValues[propertyTypeId]) {
        const filteredValues = propValues[propertyTypeId].filter((value) => {
          return (value.length);
        });
        if (filteredValues.length) {
          const datatype = propertyType.get('datatype');
          if (EdmConsts.EDM_DATE_TYPES.includes(datatype)) {
            const formattedDates = filteredValues.map((value) => {
              const val = moment(value);
              return datatype === 'Date' ? val.format('YYYY-MM-DD') : val.toISOString();
            });
            formattedValues[propertyTypeId] = formattedDates;
          }
          else {
            formattedValues[propertyTypeId] = filteredValues;
          }
        }
      }
    });

    const entityId = this.getEntityId(this.props.primaryKey, formattedValues);
    return { [entityId]: formattedValues };
  }

  onSubmit = (e) => {
    e.preventDefault();
    const entities = this.generateEntites();
    DataApi.createEntityData(this.props.entitySetId, '', entities)
    .then(() => {
      const propValues = {};
      this.state.authorizedPropertyTypes.forEach((propertyType) => {
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
    this.state.authorizedPropertyTypes.forEach((propertyType) => {
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
    return this.state.authorizedPropertyTypes.map((propertyType) => {
      const id = propertyType.get('id');
      let input = (<FormControl
          type="text"
          onChange={(e) => {
            this.updatePropertyTypeValue(id, e.target.value);
          }} />);
      if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.get('datatype'))) {
        const value = this.state.propValues[id][0];
        input = (
          <DatePicker
              id={`date-${id}`}
              value={value}
              showTodayButton
              onChange={(date) => {
                this.updatePropertyTypeValue(id, date);
              }} />);
      }

      const title = this.props.entitySetPropertyMetadata.getIn([id, 'title'], propertyType.get('title'));
      return (
        <FormGroup key={id}>
          <ControlLabel>{title}</ControlLabel>
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
