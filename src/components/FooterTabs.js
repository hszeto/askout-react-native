import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, 
         Button, Icon, Footer, FooterTab,
         Text, Tab, Tabs } from 'native-base';
import { Actions  } from 'react-native-router-flux';

class FooterTabs extends Component {
  onLogoutButtonPress() {
    this.props.logoutUser();
  }

  render() {
    return(
      <Container>
        <Footer>
          <FooterTab>
            <Button>
              <Text>Events</Text>
              <Icon name='ios-calendar-outline' />
            </Button>
            <Button active>
              <Text>Chats</Text>
              <Icon name='ios-chatbubbles-outline' />
            </Button>
            <Button
              onPress={Actions.friends}
            >
              <Text>Friends</Text>
              <Icon name='ios-people-outline' />
            </Button>
            <Button>
              <Text>Me</Text>
              <Icon name='ios-menu-outline' />
            </Button>
            <Button onPress={this.onLogoutButtonPress.bind(this)}>
              <Text>Logout</Text>
              <Icon name='ios-log-out-outline' />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default connect(null, {})(FooterTabs);
