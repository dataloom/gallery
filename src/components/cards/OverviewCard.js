/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';

import StyledFlexContainer from '../flex/StyledFlexContainer';
import StyledFlexContainerStacked from '../flex/StyledFlexContainerStacked';

const Card = styled(StyledFlexContainerStacked)`
  background-color: #eceff1;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 24px 16px 16px;
`;

const CardTitle = styled.h3`
  margin: 0;
`;

const CardDescription = styled.h5`
  margin: 0;
`;

const CardTitleAction = styled(StyledFlexContainer)`
  margin-bottom: 16px;
  align-items: flex-start;
  justify-content: space-between;
`;

export default class OverviewCard extends React.Component {

  static propTypes = {
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    actionControl: React.PropTypes.node
  };

  render() {

    return (
      <Card>
        <CardTitleAction>
          <CardTitle>{ this.props.title }</CardTitle>
          { this.props.actionControl }
        </CardTitleAction>
        <CardDescription>{ this.props.description }</CardDescription>
      </Card>
    );
  }
}
