import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { PropertyTypePropType } from '../EdmModel';
import { createPropertyTypeReference, getEdmObjectSilent } from '../EdmStorage';
import ExpandableText from '../../../components/utils/ExpandableText';
import styles from './propertype.module.css';

const MAX_DESCRIPTION_LENGTH = 300;

// TODO: Make PropertyType a container that takes a PropertyType reference
class PropertyType extends React.Component {
  static propTypes = {
    propertyTypeId: PropTypes.string.isRequired,
    propertyType: PropertyTypePropType,
  };

  renderEmptyProperty() {
    return (
      <div className={classnames(styles.propertyType, styles.empty)}>
        <div className={styles.title}>LOADING!</div>
        <div className={styles.description}></div>
      </div>
    );
  }

  render() {
    const { propertyType } = this.props;

    if (!propertyType) {
      return this.renderEmptyProperty();
    }

    let description;
    if (propertyType.description) {
      description = (<ExpandableText text={propertyType.description} maxLength={MAX_DESCRIPTION_LENGTH}/>);
    } else {
      description = (<em>No description</em>);
    }

    return (
      <div className={styles.propertyType}>
        <div className={styles.title}>{propertyType.title}</div>
        <div className={styles.description}>
          {description}
        </div>
      </div>
    );
  }
}


function mapStateToProps(state, ownProps) {
  const entitySetDetail = state.get('entitySetDetail'),
    normalizedData = state.get('normalizedData'),
    reference = createPropertyTypeReference(ownProps.propertyTypeId);

  return {
    propertyType: getEdmObjectSilent(normalizedData.toJS(), reference, null)
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyType);