/*
 * @flow
 */

import React from 'react';

class App extends React.Component {

  state :{
    message :string
  };

  constructor(props :Object) {

    super(props);
    this.state = {
      message: 'Hello, World!'
    };
  }

  render() {

    return (
      <h1>{this.state.message}</h1>
    );
  }
}

export default App;
