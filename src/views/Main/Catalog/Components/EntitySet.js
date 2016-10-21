import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { DataApi, EntityDataModelApi } from 'loom-data';
import Consts from '../../../../utils/AppConsts';
import { PropertyList } from './PropertyList';
import { PermissionsPanel } from './PermissionsPanel';
import styles from '../styles.module.css';

export class EntitySet extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      editing: false,
      properties: [],
      showPanel: false
    };
  }

  componentDidMount() {
    EntityDataModelApi.getEntityType(this.props.type)
    .then((type) => {
      this.setState({
        properties: type.properties
      });
    });
  }

  shouldShow = {
    true: Consts.EMPTY,
    false: styles.hidden
  };

  changeEditingState = () => {
    this.setState({
      editing: !this.state.editing
    });
  }

  exitPanel = () => {
    this.setState({
      showPanel: false
    });
  }

  editEntitySetPermissions = () => {
    this.setState({ showPanel: true });
  }

  getUrl = datatype =>
    DataApi.getAllEntitiesOfTypeInSetUrl(this.props.type, this.props.name, datatype);

  render() {
    const { name, title, type } = this.props;
    return (
      <div className={styles.edmContainer}>
        <Button onClick={this.changeEditingState}>
          {(this.state.editing) ? 'Stop editing' : 'Edit permissions'}
        </Button>
        <div className={styles.spacerSmall} />
        <div className={styles.name}>{name}</div>
        <div className={styles.descriptionLabel}> (name)</div>
        <div className={styles.spacerLeft} />
        <Button
          className={this.shouldShow[this.state.editing]}
          onClick={this.editEntitySetPermissions}
        >Change permissions</Button>
        <br />
        <div className={styles.subtitle}>{title}</div>
        <div className={styles.descriptionLabel}> (title)</div>
        <div className={styles.spacerSmall} />
        <div className={this.shouldShow[this.state.showPanel]}>
          <PermissionsPanel entitySetName={name} entityType={type} exitPanel={this.exitPanel} />
        </div>
        <div className={styles.tableDescriptionLabel}>Type:</div>
        <div>
          <table>
            <tbody>
              <tr>
                <th className={styles.tableCell}>Name</th>
                <th className={styles.tableCell}>Namespace</th>
              </tr>
              <tr className={styles.tableRows}>
                <td className={styles.tableCell}>{type.name}</td>
                <td className={styles.tableCell}>{type.namespace}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={this.shouldShow[this.state.editing]}>
          <div className={styles.spacerMed} />
          <div className={styles.tableDescriptionLabel}>Properties:</div>
          <PropertyList
            properties={this.state.properties}
            entityTypeName={type.name}
            entityTypeNamespace={type.namespace}
            allowEdit={false}
            editingPermissions
            entitySetName={name}
          />
        </div>
        <div className={styles.spacerSmall} />
        <Button href={this.getUrl(Consts.JSON)}>
          Download {name} as JSON
        </Button>
        <Button href={this.getUrl(Consts.CSV)} className={styles.spacerMargin}>
          Download {name} as CSV
        </Button>
      </div>
    );
  }
}

export default EntitySet;
