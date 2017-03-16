import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import moment from 'moment';
import { AuthorizationApi, DataApi } from 'loom-data';
import { Permission } from '../../core/permissions/Permission';
import EdmConsts from '../../utils/Consts/EdmConsts';

import styles from './entitysetforms.module.css';

const BASE_SYNC_ID = '00000000-0000-0000-0000-000000000000';

export default class AddDataForm extends React.Component {

  static propTypes = {
    entitySetId: PropTypes.string.isRequired,
    primaryKey: PropTypes.array.isRequired,
    propertyTypes: PropTypes.array.isRequired
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

    const accessChecks = this.props.propertyTypes.map((propertyType) => {
      return {
        aclKey: [this.props.entitySetId, propertyType.id],
        permissions: [Permission.WRITE.name]
      };
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
        if (!Object.keys(propValues).includes(keyPropId)) canWrite = false;
      });
      if (!canWrite) {
        this.setState({ noPermissions: true });
      }
      else {
        const authorizedPropertyTypes = this.props.propertyTypes.filter((propertyType) => {
          return Object.keys(propValues).includes(propertyType.id);
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
    authorizedPropertyTypes.forEach((propertyType) => {
      if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype)) {
        localDateTimes[propertyType.id] = [moment(propValues[propertyType.id]).format('YYYY-MM-DDThh:mm:ss')];
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
    DataApi.createEntityData(this.props.entitySetId, BASE_SYNC_ID, entities)
    .then(() => {
      const propValues = {};
      this.state.authorizedPropertyTypes.forEach((propertyType) => {
        propValues[propertyType.id] = [''];
      });
      this.setState({
        createSuccess: true,
        createFailure: false,
        propValues: {}
      });
    }).catch(() => {
      this.setState({
        createSuccess: false,
        createFailure: true
      });
    });
  }

  reset = () => {
    this.setState({
      propValues: {},
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
      let input = (<FormControl
          type="text"
          onChange={(e) => {
            this.updatePropertyTypeValue(propertyType.id, e.target.value);
          }} />);
      if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype)) {
        const value = this.state.propValues[propertyType.id][0];
        input = (
          <DatePicker
              id={`date-${propertyType.id}`}
              value={value}
              showTodayButton
              onChange={(date) => {
                this.updatePropertyTypeValue(propertyType.id, date);
              }} />);
      }
      return (
        <FormGroup key={propertyType.id}>
          <ControlLabel>{propertyType.title}</ControlLabel>
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
