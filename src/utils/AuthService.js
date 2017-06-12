import { EventEmitter } from 'events';
import { hashHistory } from 'react-router';

import Auth0Lock from 'auth0-lock';

import * as Cookies from 'js-cookie';

import { isTokenExpired } from './jwtHelper';
import img from '../images/empty-logo.png';
import PageConsts from './Consts/PageConsts';

export default class AuthService extends EventEmitter {
  constructor(clientId, domain, isLocal) {
    super();
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {
      closable: false,
      theme: {
        logo: img
      },
      languageDictionary: {
        title: 'Lattice'
      },
      auth: {
        params: {
          scope: 'openid email user_metadata app_metadata nickname roles user_id'
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
    this.isLocal = isLocal;
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

    // Bugfix for redirect race conditions in IE & Safari
    // As soon as authentication is complete -> redirect to home
    hashHistory.push(`/${PageConsts.HOME}`);
  }

  authorizationError(error) {
    // Unexpected authentication error
    this.emit(error);
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  hideLoginPrompt() {
    this.lock.hide();
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
    const prefix = (this.isLocal) ? '' : '.';
    Cookies.set('authorization', `Bearer ${idToken}`, {
      domain: `${prefix}${window.location.hostname}`
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
