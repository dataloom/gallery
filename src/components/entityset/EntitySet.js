// @flow

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { SplitButton, Button, MenuItem } from 'react-bootstrap';

import { DataApi, EntityDataModelApi, PermissionsApi } from 'loom-data';

import FileConsts from '../../utils/Consts/FileConsts';
import PageConsts from '../../utils/Consts/PageConsts';
import styles from './entityset.module.css';

const MAX_DESCRIPTION_LENGTH = 300;

class ExpandableText extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    maxLength: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };

    this.switchState = () => {
      this.setState({ isOpen: !this.state.isOpen });
    }
  }

  render() {
    let {text, maxLength} = this.props;
    if (text.length <= maxLength) {
      return text;
    }

    let {isOpen} = this.state,
      controlText,
      displayText;
    if (isOpen) {
      controlText = "Read less";
      displayText = text;
    } else {
      controlText = "Read more";
      displayText = text.substring(0, maxLength) + "...";
    }

    return (
      <div>
        {displayText}
        <Button bsStyle="link" className={styles.expandTextButton} onClick={this.switchState}>{controlText}</Button>
      </div>
    );

  }
}

export class EntitySet extends React.Component {
  static propTypes = {
    // TODO: Use flow to specify types
    entitySet: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      editing: false,
      showPanel: false,
      permissionRequestStatus: {
        display: styles.hidden,
        msg: ''
      }
    };
  }

  getUrl(datatype) {
    let entitySet = this.props.entitySet;
    return DataApi.getAllEntitiesOfTypeInSetFileUrl(entitySet.type, entitySet.name, datatype);
  }

  render() {
    const { entitySet } = this.props;
    let type = entitySet.type;

    return (
      <article className={styles.entitySet}>
        <header>
          <h2 className={styles.title}>
            {entitySet.title}
            <small className={styles.subtitle}>{entitySet.type.namespace}.{entitySet.type.name}</small>
          </h2>

          <div className={styles.controls}>
            <SplitButton pullRight title="Actions" id="action-dropdown">
              <MenuItem header>Download</MenuItem>
              <MenuItem href={this.getUrl(FileConsts.CSV)}>CSV</MenuItem>
              <MenuItem href={this.getUrl(FileConsts.JSON)}>JSON</MenuItem>
              <MenuItem divider/>
              <li role="presentation">
                <Link
                  to={`/${PageConsts.VISUALIZE}?name=${entitySet.name}&typeNamespace=${type.namespace}&typeName=${type.name}`}>
                  Visualize
                </Link>
              </li>
            </SplitButton>
          </div>
        </header>
        <ExpandableText maxLength={MAX_DESCRIPTION_LENGTH} text={entitySet.description} />
      </article>
    );
  }
}

export default EntitySet;
