import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content,
         Footer, FooterTab, Button, Icon, Badge, Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { logoutUser } from '../actions';

class Dashboard extends Component {
  onLogoutButtonPress() {
    this.props.logoutUser();
  }

  render() {
    return(
      <Container>
        <Header>
          <Title>React Native Firebase Auth - Dashboard</Title>
        </Header>
        <Content>
          <Text>
            Hello {this.props.user.email}!
          </Text>
        </Content>
        <Footer>
          <FooterTab>
            <Button>
              <Badge>2</Badge>
              <Text>blah</Text>
              <Icon name='ios-apps-outline' />
            </Button>
            <Button active>
              <Text>Blah</Text>
              <Icon name='ios-compass' />
            </Button>
            <Button>
              <Text>BLAH</Text>
              <Icon name='ios-contact-outline' />
            </Button>
            <Button onPress={this.onLogoutButtonPress.bind(this)}>
              <Text>Logout</Text>
              <Icon name='ios-log-out' />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { user } = auth;

  return { user };
};

export default connect(mapStateToProps, {logoutUser})(Dashboard);
