import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content,
         Card, CardItem, Button, Text,
         InputGroup, Input, Spinner, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { emailChanged, passwordChanged, retrieveUserFromLocalStorage,
         signInUser, signUpUser } from '../actions';

class SignIn extends Component {
  componentDidMount() {
    const { message } = this.props;

    if (message) {
      Toast.show({
        text: message,
        position: 'bottom',
        buttonText: 'X'
      });
    }

    // Find user from localstorage if already login
    this.props.retrieveUserFromLocalStorage();
  }

  componentDidUpdate() {
    const { message } = this.props;

    if (message) {
      Toast.show({
        text: message,
        position: 'bottom',
        buttonText: 'X'
      });
    }
  }

  onEmailChange(text) {
    this.props.emailChanged(text);
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onSignInButtonPress() {
    const { email, password } = this.props;

    this.props.signInUser({ email, password });
  }

  onSignUpButtonPress = () => {
    const { email, password } = this.props;

    this.props.signUpUser({ email, password });
  };

  renderButton() {
    if (this.props.loading) {
      return <Spinner />;
    }

    return (
      <Content>
        <Grid>
          <Col>
            <Button onPress={this.onSignInButtonPress.bind(this)}>
              <Text>Sign In</Text>
            </Button>
          </Col>
          <Col></Col>
          <Col>
            <Button onPress={this.onSignUpButtonPress}>
              <Text>Sign Up</Text>
            </Button>
          </Col>
        </Grid>
      </Content>
    );
  }

  render() {
    return(
      <Container>
        <Content>
          <Card>
            <CardItem>
              <InputGroup borderType='regular'>
                <Input
                  placeholder='Email'
                  onChangeText={this.onEmailChange.bind(this)}
                  value={this.props.email}
                />
              </InputGroup>
            </CardItem>

            <CardItem>
              <InputGroup>
                <Input
                  secureTextEntry
                  placeholder="Password"
                  onChangeText={e => this.onPasswordChange(e)}
                  value={this.props.password}
                />
              </InputGroup>
            </CardItem>

            <CardItem>
              {this.renderButton()}
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { email, password, message, loading } = auth;

  return { email, password, message, loading };
};

export default connect(mapStateToProps, {
  emailChanged, passwordChanged, signInUser,
  signUpUser, retrieveUserFromLocalStorage
})(SignIn);
