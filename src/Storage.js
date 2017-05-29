import React from 'react';
import { AsyncStorage } from 'react-native';

export function setToken(token) {
  return AsyncStorage.setItem('access_token', token);
}

export function getToken() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(
      'access_token'
    ).then(response => resolve({
      access_token: response
    })
    ).catch(ex => reject(ex));
  });
}

export function clearStorage() {
  AsyncStorage.clear(() => {
    setToken('');
  });
}

window.safelyClearStorage = clearStorage;
