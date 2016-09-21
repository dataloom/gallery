import React from 'react'
import {Route, IndexRedirect} from 'react-router'
import AuthService from 'utils/AuthService'
import Container from './Container'
import Catalog from './Catalog/Catalog'
import Login from './Login/Login'

const CONSTS = require('../../../config/consts');
const auth = new AuthService(CONSTS.AUTH0_CLIENT_ID, CONSTS.AUTH0_DOMAIN);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

export const makeMainRoutes = () => {
  return (
    <Route path="/" component={Container} auth={auth}>
      <IndexRedirect to="/catalog" />
      <Route path="catalog" component={Catalog} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="access_token=:token" component={Login} /> //to prevent router errors
    </Route>
  )
}

export default makeMainRoutes
