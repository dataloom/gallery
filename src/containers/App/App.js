import React, { PropTypes } from 'react';
import { Router, hashHistory } from 'react-router';
import './styles.module.css';

class App extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    routes: PropTypes.element.isRequired
  };

  renderContent() {
    return (
      <Router
        routes={this.props.routes}
        history={hashHistory}
      />
    );
  }

  render() {
    return (
      <div className={'full'}>
        {this.renderContent()}
      </div>
    );
  }
}

export default App;
