/*
 * @flow
 */

import * as React from 'react';

import Immutable from 'immutable';
import moment from 'moment';
import styled, { css } from 'styled-components';
import { Models } from 'lattice';

import { FIRST_NAMES, LAST_NAMES, DOBS } from '../../../utils/Consts/StringConsts';

import defaultUserIcon from '../../../images/user-profile-icon.png';

const {
  FullyQualifiedName
} = Models;

const PersonCardOuter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 20px;
`;

const PersonCardInner = styled.div`
  display: flex;
  padding: 10px;
  &:hover {
    cursor: pointer;
    background-color: #f8f8f8;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

const DetailItem = styled.div`
  margin: 4px 0;
  font-size: 17px;
`;

const Picture = styled.img`
  max-height: 100px;
`;

type Props = {
  data :Map<string, any>,
  onClick :Function
};

type State = {};

class PersonCard extends React.Component<Props, State> {

  static defaultProps = {
    data: Immutable.Map(),
    onClick: () => {}
  };

  shouldCheckKey = (key :string) => {
    return key !== 'id' && key !== 'count';
  }

  formatValue = (rawValue :any) => {

    if (rawValue instanceof Array) {
      let formattedValue = '';
      if (rawValue.length > 0) {
        formattedValue = formattedValue.concat(rawValue[0]);
      }
      if (rawValue.length > 1) {
        for (let i = 1; i < rawValue.length; i += 1) {
          formattedValue = formattedValue.concat(', ').concat(rawValue[i]);
        }
      }
      return formattedValue;
    }
    return rawValue;
  }

  getFirstNameVal = () => {

    let firstNameValue;
    this.props.data.forEach((value, key) => {
      if (this.shouldCheckKey(key)) {
        try {
          const fqn = new FullyQualifiedName(key);
          if (FIRST_NAMES.includes(fqn.getName().toLowerCase())) {
            firstNameValue = value;
            return false; // break out of loop
          }
        }
        catch (e) {}
      }
    })

    if (!firstNameValue) {
      return '';
    }

    return this.formatValue(firstNameValue.toJS());
  }

  getLastNameVal = () => {

    let lastNameValue;
    this.props.data.forEach((value, key) => {
      if (this.shouldCheckKey(key)) {
        try {
          const fqn = new FullyQualifiedName(key);
          if (LAST_NAMES.includes(fqn.getName().toLowerCase())) {
            lastNameValue = value;
            return false; // break out of loop
          }
        }
        catch (e) {}
      }
    });

    if (!lastNameValue) {
      return '';
    }

    return this.formatValue(lastNameValue.toJS());
  }

  getDobVal = () => {

    let dobValue;
    this.props.data.forEach((value, key) => {
      if (this.shouldCheckKey(key)) {
        try {
          const fqn = new FullyQualifiedName(key);
          if (DOBS.includes(fqn.getName().toLowerCase())) {
            dobValue = value.map((dateString) => {
              const date = moment.utc(dateString);
              return (date.isValid()) ? date.format('MMMM D, YYYY') : dateString;
            });
            return false; // break out of loop
          }
        }
        catch (e) {}
      }
    });

    if (!dobValue) {
      return '';
    }

    return this.formatValue(dobValue.toJS());
  }

  getCountVal = () => {

    const countValue = this.props.data.get('count', Immutable.List());
    return this.formatValue(countValue.toJS());

  }

  countPresent = () => {
    return this.props.data.has

    let showCountColumn = false;
    this.state.searchResults.forEach((result) => {
      if (result.has('count')) {
        showCountColumn = true;
      }
    });

    return showCountColumn;

  }

  getPictureImgSrc = () => {

    let pictureValue;
    this.props.data.forEach((value, key) => {
      if (this.shouldCheckKey(key)) {
        try {
          const fqn = new FullyQualifiedName(key);
          const fqnName = fqn.getName().toLowerCase();
          if (fqnName === 'mugshot' || fqnName === 'picture') {
            pictureValue = value;
            return false; // break out of loop
          }
        }
        catch (e) {}
      }
    });

    let imgSrc = defaultUserIcon;
    if (pictureValue && !pictureValue.isEmpty()) {
      const pictureSrc = pictureValue.get(0);
      imgSrc = `data:image/png;base64,${pictureSrc}`;
    }

    return imgSrc;
  }

  render() {

    return (
      <PersonCardOuter onClick={this.props.onClick}>
        <PersonCardInner>
          <Picture src={this.getPictureImgSrc()} role="presentation" />
          <UserDetails>
            <DetailItem><b>First Name:</b> {this.getFirstNameVal()}</DetailItem>
            <DetailItem><b>Last Name:</b> {this.getLastNameVal()}</DetailItem>
            <DetailItem><b>Date of Birth:</b> {this.getDobVal()}</DetailItem>
            { this.props.data.has('count') ? <DetailItem><i><b>Count:</b> {this.getCountVal()}</i></DetailItem> : null }
          </UserDetails>
        </PersonCardInner>
      </PersonCardOuter>
    );
  }
}

export default PersonCard;
