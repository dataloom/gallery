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
    var lock = new Auth0Lock('KvwsETaUxuXVjW2cmz2LbdqXQBdYs6wH', 'loom.auth0.com');
    var btn_login = document.getElementById('btn-login');
    btn_login.addEventListener('click', function() {
      lock.show();
    });
    lock.on("authenticated", function(authResult) {
      lock.getProfile(authResult.idToken, function(error, profile) {
        if (error) {
          this.state.message = 'Login failed.'
          // Handle error
          return;
        }
        localStorage.setItem('id_token', authResult.idToken);
        // Display user information
        this.state.message = 'You are logged in!!!'
        show_profile_info(profile);
      });
    });

    return (
      <h1>{this.state.message}</h1>
    );
  }
}

export default App;
