import React, { Component } from 'react';
import { Container, Icon, Text } from 'native-base';
import { Scene, Router, Actions, TabBar } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import Events from './components/Events';
import Friends from './components/Friends';

class TabIcon extends Component {
  render() {
    var tab_title = this.props.title;
    var icon_name = '';

    switch(tab_title) {
      case "Events":
        icon_name = "ios-calendar-outline";
        break;
      case "Chats":
        icon_name = "ios-chatbubbles-outline";
        break;
      case "Friends":
        icon_name = "ios-people-outline";
        break;
      case "Me":
        icon_name = "ios-menu-outline";
        break;
      case "Logout":
        icon_name = "ios-log-out-outline";
        break;
      default:
        break;
    }

    return(
        <Container>
          <Text>{tab_title}</Text>
          <Icon name={icon_name} />
        </Container>
      );
  }
}

const RouterComponent = () => {
  return (
    <Router sceneStyle={{ paddingTop: 8 }}>
      {/*<Scene key="auth">
        <Scene key="login" component={LoginForm} hideNavBar={true}/>
        <Scene key="signup" component={SignupForm} hideNavBar={true}/>
      </Scene>*/}

     {/* <Scene key="main">
        <Scene key="events" component={Events} hideNavBar={true} />
        <Scene key="friends" component={Friends} hideNavBar={true} />
          // <Scene key="dashboard" component={Dashboard} hideNavBar={true}/>
      </Scene>
    */}

      <Scene key="main">
        <Scene key="tabbar" tabs={true}>
          <Scene key="tab1" title="Events" icon={TabIcon} navigationBarStyle={{backgroundColor:'#d2d2d2'}} titleStyle={{color:'black'}}>
            <Scene key="events" component={Events} hideNavBar={true} />
          </Scene>
          <Scene key="tab2" title="Chats" icon={TabIcon} navigationBarStyle={{backgroundColor:'#d2d2d2'}} titleStyle={{color:'black'}}>
            <Scene key="chats" component={Friends} hideNavBar={true} />
          </Scene>
          <Scene key="tab3" title="Friends" icon={TabIcon} navigationBarStyle={{backgroundColor:'#d2d2d2'}} titleStyle={{color:'black'}}>
            <Scene key="friends" component={Friends} hideNavBar={true} />
          </Scene>
          <Scene key="tab4" title="Me" icon={TabIcon} navigationBarStyle={{backgroundColor:'#d2d2d2'}} titleStyle={{color:'black'}}>
            <Scene key="me" component={Friends} hideNavBar={true} />
          </Scene>
          <Scene key="tab5" title="Logout" icon={TabIcon} navigationBarStyle={{backgroundColor:'#d2d2d2'}} titleStyle={{color:'black'}}>
            <Scene key="logout" component={Friends} hideNavBar={true} />
          </Scene>
        </Scene>
      </Scene>
    </Router>
  );
};

export default RouterComponent;
