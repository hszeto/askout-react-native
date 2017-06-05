import React from 'react';
import { AsyncStorage } from 'react-native';


export function setAccessToken(token) {
  return AsyncStorage.setItem('access_token', token);
}

export function getAccessToken() {
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
  return new Promise((resolve, reject) => {
    AsyncStorage.clear(() => {
      setAccessToken('');
    })
    .then(response => {
      console.log( "Clear!" );
      resolve();
    })
    .catch(ex => reject(ex));
  });
}

window.safelyClearStorage = clearStorage;
