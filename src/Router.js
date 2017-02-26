import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';

const RouterComponent = () => {
  return (
    <Router sceneStyle={{ paddingTop: 8 }}>
      <Scene key="auth">
        <Scene key="login" component={LoginForm} hideNavBar={true}/>
        <Scene key="signup" component={SignupForm} hideNavBar={true}/>
      </Scene>

      <Scene key="main">
        <Scene key="dashboard" component={Dashboard} hideNavBar={true}/>
      </Scene>
    </Router>
  );
};

export default RouterComponent;
