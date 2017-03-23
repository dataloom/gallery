import React, { PropTypes } from 'react';
import { PropertyType } from './PropertyType';
import styles from '../styles.module.css';

export default class PropertyTypeSearchResults extends React.Component {

  static propTypes = {
    results: PropTypes.array
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      loadTypesError: false,
      idToPropertyTypes: {}
    };
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  render() {
    const propertyTypeList = this.props.results.map((propertyType) => {
      return (<PropertyType
          key={propertyType.id}
          propertyType={propertyType} />);
    });

    return (
      <div>
        {propertyTypeList}
      </div>
    );
  }
}
