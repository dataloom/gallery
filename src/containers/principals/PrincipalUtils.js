import { Iterable } from 'immutable';

function getProperty(object, propertyName) {
  return Iterable.isIterable(object) ? object.get(propertyName) : object[propertyName];
}

export function getDisplayName(principal) {
  const givenName = getProperty(principal, 'given_name');
  if (givenName) {
    return givenName;
  }

  const name = getProperty(principal, 'name');
  if (name) {
    return name;
  }

  const nickname = getProperty(principal, 'nickname');
  if (nickname) {
    return nickname;
  }

  const email = getProperty(principal, 'email');
  if (email) {
    return email;
  }

  return '';
}