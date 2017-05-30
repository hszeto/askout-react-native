import React from 'react';
import { AsyncStorage } from 'react-native';

export function setIdToken(token) {
  return AsyncStorage.setItem('id_token', token);
}
export function setAccessToken(token) {
  return AsyncStorage.setItem('access_token', token);
}
export function setRefreshToken(token) {
  return AsyncStorage.setItem('refresh_token', token);
}
export function setEmailAnd3Tokens(email,idt, act, rft) {
  return AsyncStorage.multiSet( [['email', email],['id_token', idt],['access_token', act],['refresh_token', rft]] );
}

export function getIdToken() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(
      'id_token'
    ).then(response => resolve({
      id_token: response
    })
    ).catch(ex => reject(ex));
  });
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
export function getRefreshToken() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(
      'refresh_token'
    ).then(response => resolve({
      refresh_token: response
    })
    ).catch(ex => reject(ex));
  });
}
export function getEmailAnd3Tokens() {
  return new Promise((resolve, reject) => {
    AsyncStorage.multiGet(
      ['email','id_token','access_token','refresh_token']
    ).then(response => resolve({
      stored: response
    })
    ).catch(ex => reject(ex));
  });
}

export function clearStorage() {
  return new Promise((resolve, reject) => {
    AsyncStorage.clear(() => {
      setIdToken('');
      setAccessToken('');
      setRefreshToken('');
      setEmailAnd3Tokens('','','','');
    })
    .then(response => {
      console.log( "Clear!" );
      resolve();
    })
    .catch(ex => reject(ex));
  });
}

window.safelyClearStorage = clearStorage;
