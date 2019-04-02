import { EventEmitter } from 'events';
import { hashHistory } from 'react-router';

import Auth0Lock from 'auth0-lock';

import * as Cookies from 'js-cookie';

import { isTokenExpired } from './jwtHelper';
import logo from '../images/ol_logo_v2.png';
import PageConsts from './Consts/PageConsts';

// injected by Webpack.DefinePlugin
declare var __DEV__;

export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super();
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {
      closable: false,
      theme: {
        logo
      },
      languageDictionary: {
        title: 'OpenLattice'
      },
      auth: {
        params: {
          scope: 'openid email user_metadata app_metadata nickname roles user_id'
        }
      },
      rememberLastLogin: false
    });
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this.doAuthentication.bind(this));
    // Add callback for lock `authorization_error` event
    this.lock.on('authorization_error', this.authorizationError.bind(this));
    // binds login functions to keep this context
    this.login = this.login.bind(this);
    this.storage = localStorage;
    this.domain = location.hostname.split('.').splice(-2).join('.');
  }

  doAuthentication(authResult) {
    // Saves the user token
    this.setToken(authResult.idToken);
    // Async loads the user profile data
    this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
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
    const prefix = (__DEV__) ? '' : '.';
    Cookies.set('authorization', `Bearer ${idToken}`, {
      domain: `${prefix}${this.domain}`
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

    // when deleting a cookie, we must pass the exact same path and domain attributes that was used to set the cookie
    // https://github.com/js-cookie/js-cookie
    const prefix = (__DEV__) ? '' : '.';
    Cookies.remove('authorization', {
      domain: `${prefix}${this.domain}`
    });
  }
}
