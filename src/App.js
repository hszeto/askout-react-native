import React, { Component } from 'react';
import firebase from 'firebase';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Router from './Router';

class App extends Component {
  componentWillMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyAfG-G_K58KIl32WsZ9hnNFUtaVuN_bVmo',
      authDomain: 'askout-63c1e.firebaseapp.com',
      databaseURL: 'https://askout-63c1e.firebaseio.com',
      storageBucket: 'askout-63c1e.appspot.com',
      messagingSenderId: '895033244248'
    });
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return(
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

export default App;
