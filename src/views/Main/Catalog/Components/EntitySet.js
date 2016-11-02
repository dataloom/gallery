import React, { PropTypes } from 'react';
import { DataApi, EntityDataModelApi } from 'loom-data';
import { PropertyList } from './PropertyList';
import { DropdownButton } from './DropdownButton';
import Consts from '../../../../utils/AppConsts';
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
      properties: []
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


  getUrl = (datatype) => {
    return DataApi.getAllEntitiesOfTypeInSetFileUrl(this.props.type, this.props.name, datatype);
  }

  render() {
    const { name, title, type } = this.props;
    const downloadOptions = [Consts.CSV, Consts.JSON];
    return (
      <div className={styles.edmContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.spacerMed} />
        <div className={styles.subtitle}>{title}</div>
        <div className={styles.spacerMed} />
        <div className={styles.dropdownButtonContainer}>
          <DropdownButton downloadUrlFn={this.getUrl} downloadOptions={downloadOptions} />
        </div>
        <div>
          <table>
            <tbody>
              <tr>
                <th className={styles.tableCell}>Entity Type Name</th>
                <th className={styles.tableCell}>Entity Type Namespace</th>
              </tr>
              <tr className={styles.tableRows}>
                <td className={styles.tableCell}>{type.name}</td>
                <td className={styles.tableCell}>{type.namespace}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.spacerBig} />
        <PropertyList
          properties={this.state.properties}
          entityTypeName={type.name}
          entityTypeNamespace={type.namespace}
          allowEdit={false}
          entitySetName={name}
        />
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default EntitySet;
