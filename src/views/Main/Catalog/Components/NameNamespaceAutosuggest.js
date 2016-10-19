import React, { PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import { Button } from 'react-bootstrap';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';

export class NameNamespaceAutosuggest extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    names: PropTypes.object,
    namespaces: PropTypes.object,
    className: PropTypes.string,
    addProperty: PropTypes.func
  }

  constructor(props, context) {
    super(props, context);
    this.state = { entitySets: [] };
  }

  handleSubmit = () => {
    const id = this.props.id;
    const namespace = document.getElementById('newPropNamespace'.concat(id)).value;
    const name = document.getElementById('newPropName'.concat(id)).value;
    this.props.addProperty(namespace, name)
    document.getElementById('newPropNamespace'.concat(id)).value = Consts.EMPTY;
    document.getElementById('newPropName'.concat(id)).value = Consts.EMPTY;
  }

  render() {
    return (
      <tr className={this.props.className}>
        <td />
        <td><input
          type="text"
          id={'newPropName'.concat(this.props.id)}
          placeholder="name"
          className={styles.tableCell}
        /></td>
        <td><input
          type="text"
          id={'newPropNamespace'.concat(this.props.id)}
          placeholder="namespace"
          className={styles.tableCell}
        /></td>
        <td><Button onClick={this.handleSubmit}>Save</Button></td>
      </tr>
    );
  }
}

export default NameNamespaceAutosuggest;
