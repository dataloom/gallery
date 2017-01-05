import React from 'react';
import { Route } from 'react-router';
import { makeMainRoutes } from './views/Main/routes';

export default function makeRoutes() {

  const main = makeMainRoutes();

  return (
    <Route path="">
      {main}
    </Route>
  );
}
