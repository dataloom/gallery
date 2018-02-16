import React from 'react';

import styled from 'styled-components';

import StyledFlexContainerStacked from '../flex/StyledFlexContainerStacked';

const Container = styled(StyledFlexContainerStacked)`
  flex: 1 0 auto;
`;

export default class ContentContainer extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {

    return (
      <Container>
        { React.Children.toArray(this.props.children) }
      </Container>
    );
  }

}
