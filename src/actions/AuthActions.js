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

import { setEmailAnd3Tokens, getEmailAnd3Tokens,
         clearStorage, setToken } from '../Storage';

const appConfig = {
  region: 'us-west-2',
  IdentityPoolId: 'us-west-2:58093303-8633-4a44-b2c8-93beec1fab13',
  UserPoolId: 'us-west-2_dBL9LS4Qn',
  ClientId: '5qjlsuuvuqe73cgnka92nu8rd0',
}

Config.region = appConfig.region;
// ================================================================

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

    const poolData = {
      UserPoolId: appConfig.UserPoolId,
      ClientId: appConfig.ClientId
    };
    const userPool = new CognitoUserPool(poolData);

    const userData = {
      Username: email,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const id_token = result.getIdToken().getJwtToken();
        const access_token = result.getAccessToken().getJwtToken();
        const refresh_token = result.refreshToken.token;

        // setToken( result.getAccessToken().getJwtToken() ).then(() => {
        setEmailAnd3Tokens( email, id_token, access_token, refresh_token )
          .then(() => {
            dispatch({ type: 'stop_loading' });
            Actions.main();
          }).catch((ex) => {
            console.log(`Error Storing Critical Info: ${ex}`);
          });

        // Config.credentials = new CognitoIdentityCredentials({
        //   IdentityPoolId: appConfig.IdentityPoolId,
        //   Logins: {
        //     [`cognito-idp.${appConfig.region}.amazonaws.com/${appConfig.UserPoolId}`]: result.getIdToken().getJwtToken()
        //   }
        // });

        // cognitoUser.getUserAttributes(function(err, result) {
        //     if (err) {
        //         alert(err);
        //         return;
        //     }
        //     for (i = 0; i < result.length; i++) {
        //         console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        //     }
        // });

        // // SignIn success
        // console.log(Config.credentials);
        // dispatch({ type: 'stop_loading' });
        // Actions.main();
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
              console.log("FORCE_CHANGE_PASSWORD: "+res);
              console.log(res.getAccessToken().getJwtToken());
              dispatch({ type: 'stop_loading' });
              Actions.main();
            },
            onFailure: (error) => {
              console.log("Sign In Failed: "+error);
              dispatch({ type: 'clear_auth_fields' });
              Actions.auth({type: 'reset'});
              alert(error);
            }
          });
      }
    });
  };
};

export const signUpUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: 'signup_user' });

    const poolData = {
      UserPoolId: appConfig.UserPoolId,
      ClientId: appConfig.ClientId
    };
    const userPool = new CognitoUserPool(poolData);

    var attributeList = [];
    var dataEmail = {
        Name : 'email',
        Value : email
    };
    var attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    userPool.signUp(email, password, attributeList, null, function(err, result){
      if (err){
        console.log("Sign Up Error: "+err);
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
    const poolData = {
      UserPoolId: appConfig.UserPoolId,
      ClientId: appConfig.ClientId
    };
    const userPool = new CognitoUserPool(poolData);

    const userData = {
      Username: email,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

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
      console.log('call result: ' + result);
      dispatch({ type: 'clear_auth_fields' });
      Actions.signin({type: 'reset'});
      alert("Code verified. Please sign in." );
    });
  };
};

export const codeResend = ({email}) => {
  return (dispatch) => {
    const poolData = {
      UserPoolId: appConfig.UserPoolId,
      ClientId: appConfig.ClientId
    };
    const userPool = new CognitoUserPool(poolData);

    const userData = {
      Username: email,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.resendConfirmationCode(function(err, result) {
      if (err) {
        dispatch({ type: 'clear_auth_fields' });
        Actions.signin({type: 'reset'});
        alert(err);
        return;
      }
      console.log('call result: ' + result);
      alert("Please check your email for the confirmation code.");
    });
  };
};

export const retrieveUserFromLocalStorage = (callback) => {
  return (dispatch) => {
    getEmailAnd3Tokens()
      .then((storage) => {
        // Check for any blank email or idToken or accessToken or RefreshToken
        let blankCheck = false;
        storage.stored.forEach((e) => {
          if (e[1] === "" || e[1] === null) {
            blankCheck = true;
          }
        });
        // return false if blank found
        if (blankCheck === true) {
          return false;
        };

        const storedEmail = storage.stored[0][1];
        const storedIdToken = storage.stored[1][1];
        const storedAccessToken = storage.stored[2][1];
        const storedRefreshToken = storage.stored[3][1];

        const poolData = {
          UserPoolId: appConfig.UserPoolId,
          ClientId: appConfig.ClientId
        };
        const userPool = new CognitoUserPool(poolData);

        const userData = {
          Username: storedEmail,
          Pool: userPool
        };

        const cognitoUser = new CognitoUser(userData);

        const authObj = { IdToken: storedIdToken,
                          AccessToken: storedAccessToken,
                          RefreshToken: storedRefreshToken };

        const userSession = cognitoUser.getCognitoUserSession(authObj)
console.log( userSession.isValid() );
        if (userSession.isValid()) {
          dispatch({ type: 'stop_loading' });
          Actions.main();
        } else {
          const RefreshToken = new CognitoRefreshToken({RefreshToken: storedRefreshToken});
          cognitoUser.refreshSession(RefreshToken, (err, sess) => {
            console.log( "so refreshing!" );
            console.log( sess );
            clearStorage()
              .then(() => {
                setEmailAnd3Tokens( storedEmail, sess.getIdToken().getJwtToken(), sess.getAccessToken().getJwtToken(), sess.refreshToken.token )
                  .then(() => {
                    console.log( "Refreshed email and 3 tokens!" );
                    return callback({repeat: true});
                  }).catch((ex) => {
                    console.log(`Error Storing Critical Info: ${ex}`);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          })
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const signOutUser = ({email}) => {
  return (dispatch) => {
    const poolData = {
      UserPoolId: appConfig.UserPoolId,
      ClientId: appConfig.ClientId
    };
    const userPool = new CognitoUserPool(poolData);

    const userData = {
      Username: email,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.signOut();

    clearStorage();

    dispatch({ 
      type: 'signout_user',
      payload: "Bye!"
    });

    Actions.auth({type: 'reset'});
  }
};

const authFailed = (dispatch, msg) => {
  dispatch({ 
    type: 'auth_fail',
    payload: msg
  });
}

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

// export const clearAuthFieldsBeforeSignup = () => {
//   return (dispatch) => {
//     dispatch({ type: 'clear_auth_fields' });

//     Actions.signup();
//   };
// };

// export const clearAuthFieldsBackToSignIn = () => {
//   return (dispatch) => {
//     dispatch({ type: 'clear_auth_fields' });

//     Actions.signin();
//   };
// };

// export const logoutUser = () => {
//   return (dispatch) => {
//     firebase.auth().signOut()
//       .then(() => {
//         dispatch({ type: 'logout_user' });
//         Actions.auth({type: 'reset'});
//       })
//       .catch((error) => console.log(error));
//   }
// };


