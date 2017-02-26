import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

export const emailChanged = (text) => {
  return {
    type: 'email_changed',
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: 'password_changed',
    payload: text
  };
};

export const clearAuthFieldsBeforeSignup = () => {
  return (dispatch) => {
    dispatch({ type: 'clear_auth_fields' });

    Actions.signup();
  };
};

export const clearAuthFieldsBackToLogin = () => {
  return (dispatch) => {
    dispatch({ type: 'clear_auth_fields' });

    Actions.login();
  };
};

export const loginUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: 'login_user' });

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user))
      .catch((error) => loginUserFail(dispatch, error.message));
  };
};

export const signupUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: 'signup_user' });

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user))
      .catch((error) => loginUserFail(dispatch, error.message));
  }
};

export const logoutUser = () => {
  return (dispatch) => {
    firebase.auth().signOut()
      .then(() => {
        dispatch({ type: 'logout_user' });
        Actions.auth({type: 'reset'});
      })
      .catch((error) => console.log(error));
  }
};

const loginUserFail = (dispatch, error_message) => {
  dispatch({ 
    type: 'login_user_fail',
    payload: error_message
  });
};

const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: 'login_user_success',
    payload: user
  });

  Actions.main();
};
