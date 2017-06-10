// import firebase from 'firebase';
import {
  Config,
  CognitoIdentityCredentials
} from 'aws-sdk/dist/aws-sdk-react-native';

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoRefreshToken
} from 'react-native-aws-cognito-js';

import { Actions } from 'react-native-router-flux';

import { setAccessToken, clearStorage } from '../Storage';

const appConfig = {
  region: 'us-west-2',
  IdentityPoolId: 'us-west-2:58093303-8633-4a44-b2c8-93beec1fab13',
  UserPoolId: 'us-west-2_dBL9LS4Qn',
  ClientId: '5qjlsuuvuqe73cgnka92nu8rd0',
}

Config.region = appConfig.region;
// =============================================
const poolData = {
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId
};
const userPool = new CognitoUserPool(poolData);

const newCognitoUser = (email) => {
  const userData = {
    Username: email,
    Pool: userPool
  };
  const newObj = new CognitoUser(userData);

  return newObj;
};

const clearAndRedirect2SignIn = (cognitoUser) => {
  if (cognitoUser != null){
    cognitoUser.getSession(function(err, session) {
      if (err) {
        console.log( "getSession FAIL when logout." );
        console.log(err);
        return;
      }

      let loginsCognitoKey = 'cognito-idp.'+ appConfig.region +'.amazonaws.com/' + appConfig.UserPoolId;
      let loginsIdpData = {};
      loginsIdpData[loginsCognitoKey] = session.getIdToken().getJwtToken();

      Config.credentials = new CognitoIdentityCredentials({
        IdentityPoolId: appConfig.IdentityPoolId,
        Logins: loginsIdpData
      }, {
        region: appConfig.region
      });
      Config.credentials.clearCachedId();
    });
    cognitoUser.clearCachedTokens();
    cognitoUser.signOut();
  }

  clearStorage();

  Actions.auth({type: 'reset'});
}
// =============================================

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

export const codeChanged = (text) => {
  return {
    type: 'code_changed',
    payload: text
  };
};

export const signInUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: 'signin_user' });

    const authenticationData = {
      Username: email,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    // userPool and newCognitoUser defined on top
    const cognitoUser = newCognitoUser(email);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        // Async store access token
        setAccessToken( result.getAccessToken().getJwtToken() );

        // Establish an user session with Cognito Identity Service
        let loginsCognitoKey = 'cognito-idp.'+ appConfig.region +'.amazonaws.com/' + appConfig.UserPoolId;
        let loginsIdpData = {};
        loginsIdpData[loginsCognitoKey] = result.getIdToken().getJwtToken();

        Config.credentials = new CognitoIdentityCredentials({
          IdentityPoolId: appConfig.IdentityPoolId,
          Logins: loginsIdpData
        }, {
          region: appConfig.region
        });

        Config.credentials.refresh((error) => {
          if (error) {
            console.error(error);
          } else {
            dispatch({ type: 'stop_loading' });
            Actions.main();
          }
        });
        // End establish an user session with Cognito Identity Service
      },
      onFailure: (err) => {
        console.log("Login Error: "+err);

        if (JSON.stringify(err).includes("UserNotConfirmedException")){
          Actions.confirmcode();
          alert("Please check your email for the confirmation code.");
        } else if (JSON.stringify(err).includes("UserNotFoundException")){
          authFailed(dispatch, "User not found. Please Sign Up an account.");
          Actions.signin({type: 'reset'});
        } else if (JSON.stringify(err).includes("InvalidParameterException")) {
          authFailed(dispatch, "Invalid Email/Password.");
          Actions.signin({type: 'reset'});
        } else {
          dispatch({ type: 'clear_auth_fields' });
          alert(err);
        }
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        delete userAttributes.email_verified;
        userAttributes['email'] = email;
        cognitoUser.completeNewPasswordChallenge(password, userAttributes, {
            onSuccess: (res) => {
              dispatch({ type: 'stop_loading' });
              Actions.main();
            },
            onFailure: (error) => {
              dispatch({ type: 'auth_fail', message: error });
              Actions.auth({type: 'reset'});
            }
          });
      }
    });
  };
};

export const signUpUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: 'signup_user' });

    // userPool defined above at around line 32

    var attributeList = [];
    var dataEmail = {
        Name : 'email',
        Value : email
    };
    var attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    userPool.signUp(email, password, attributeList, null, function(err, result){
      if (err){
        console.log("Sign Up Error: " + err);
        if (JSON.stringify(err).includes("UsernameExistsException")){
          authFailed(dispatch, "User already exists.");
        } else if (JSON.stringify(err).includes("InvalidParameterException")) {
          authFailed(dispatch, "Email/Password required.");
        } else {
          alert(err);
        }

        dispatch({ type: 'clear_auth_fields' });
        return;
      }

      Actions.confirmcode();
      alert("Please check your email for the confirmation code.");
    })
  }
};

export const codeConfirmation = ({email, code}) => {
  return (dispatch) => {
    // newCognitoUser defined on top
    const cognitoUser = newCognitoUser(email);

    cognitoUser.confirmRegistration(code, true, function(err, result) {
      if (err) {
        if (JSON.stringify(err).includes("CodeMismatchException")){
          alert("Invalid verification code, please try again.");
        } else {
          dispatch({ type: 'clear_auth_fields' });
          Actions.signin({type: 'reset'});
          alert(err);
        }
        return;
      }

      // code verification success
      dispatch({ type: 'clear_auth_fields' });
      Actions.signin({type: 'reset'});
      alert("Code verified. Please sign in." );
    });
  };
};

export const codeResend = ({email}) => {
  return (dispatch) => {
    // newCognitoUser defined on top
    const cognitoUser = newCognitoUser(email);

    cognitoUser.resendConfirmationCode(function(err, result) {
      if (err) {
        dispatch({ type: 'clear_auth_fields' });
        Actions.signin({type: 'reset'});
        alert(err);
        return;
      }
      alert("Please check your email for the confirmation code.");
    });
  };
};

export const retrieveUserFromLocalStorage = () => {
  return (dispatch) => {
    // userPool defined above at around line 32
    userPool.storage.sync((err, result) => {
      if (err) {
        console.log(err);
        clearAndRedirect2SignIn();
      } else {
        const cognitoUser = userPool.getCurrentUser();

        if (cognitoUser != null){
          cognitoUser.getSession(function(err, session) {
            if (err) {
              clearAndRedirect2SignIn(cognitoUser);
              return;
            }

            let loginsCognitoKey = 'cognito-idp.'+ appConfig.region +'.amazonaws.com/' + appConfig.UserPoolId;
            let loginsIdpData = {};
            loginsIdpData[loginsCognitoKey] = session.getIdToken().getJwtToken();

            Config.credentials = new CognitoIdentityCredentials({
              IdentityPoolId: appConfig.IdentityPoolId,
              Logins: loginsIdpData
            }, {
              region: appConfig.region
            });

            Config.credentials.refresh((error) => {
              if (error) {
                console.log(error);
                clearAndRedirect2SignIn();
              } else {
                // Async store access token
                setAccessToken( session.getAccessToken().getJwtToken() );
                dispatch({ type: 'email_changed', payload: cognitoUser.username });
                dispatch({ type: 'stop_loading' });
                Actions.main();
              }
            });
          });
        }
      }
    }); //End userPool.storage.sync
  };
};

export const signOutUser = (email) => {
  return (dispatch) => {
    // newCognitoUser defined on top
    const cognitoUser = newCognitoUser(email) || null;

    clearAndRedirect2SignIn(cognitoUser);

    dispatch({ 
      type: 'signout_user',
      payload: "Bye!"
    });
  }
};

const authFailed = (dispatch, msg) => {
  dispatch({ 
    type: 'auth_fail',
    payload: msg
  });
}

const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: 'login_user_success',
    payload: user
  });

  Actions.main();
};
