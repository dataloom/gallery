import Auth0Lock from 'auth0-lock';

import * as Cookies from 'js-cookie';

import { EventEmitter } from 'events';

import { isTokenExpired } from './jwtHelper';

export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super();
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        params: {
          scope: 'openid email user_metadata app_metadata nickname roles'
        }
      }
    });
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this.doAuthentication.bind(this));
    // Add callback for lock `authorization_error` event
    this.lock.on('authorization_error', this.authorizationError.bind(this));
    // binds login functions to keep this context
    this.login = this.login.bind(this);
    this.storage = localStorage;
  }

  doAuthentication(authResult) {
    // Saves the user token
    this.setToken(authResult.idToken);
    // Async loads the user profile data
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        this.emit('profileError');
      }
      else {
        this.setProfile(profile);
      }
    });
  }

  authorizationError(error) {
    // Unexpected authentication error
    this.emit(error);
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !isTokenExpired(token);
  }

  setProfile(profile) {
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile));
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile);
  }

  getProfile() {
    // Retrieves the profile data from localStorage
    const profile = this.storage.getItem('profile');
    return profile ? JSON.parse(this.storage.profile) : {};
  }

  setToken(idToken) {
    // Saves user token to localStorage
    this.storage.setItem('id_token', idToken);

    Cookies.set('authorization', `Bearer ${idToken}`, {
      domain: `.${window.location.hostname}`
    });
  }

  getToken() {
    // Retrieves the user token from localStorage
    return this.storage.getItem('id_token');
  }

  logout() {
    // Clear user token and profile data from localStorage
    this.storage.removeItem('id_token');
    this.storage.removeItem('profile');

    Cookies.remove('authorization');
  }
}
