import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content,
         Card, CardItem, Button, Text,
         InputGroup, Input, Spinner } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { emailChanged, passwordChanged,
         loginUser, clearAuthFieldsBeforeSignup } from '../actions';

class LoginForm extends Component {
  onEmailChange(text) {
    this.props.emailChanged(text);
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onButtonPress() {
    const { email, password } = this.props;

    this.props.loginUser({ email, password });
  }

  onSignupButtonPress() {
    this.props.clearAuthFieldsBeforeSignup();
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner />;
    }

    return (
      <Content>
        <Grid>
          <Col>
            <Button onPress={this.onButtonPress.bind(this)}>
              <Text>Login</Text>
            </Button>
          </Col>
          <Col></Col>
          <Col>
            <Button onPress={this.onSignupButtonPress.bind(this)}>
              <Text>Signup</Text>
            </Button>
          </Col>
        </Grid>
      </Content>
    );
  }

  render() {
    return(
      <Container>
        <Header>
          <Title>React Native Firebase Auth - Login</Title>
        </Header>
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
                  onChangeText={this.onPasswordChange.bind(this)}
                  value={this.props.password}
                />
              </InputGroup>
            </CardItem>

            <Text>
              {this.props.error}
            </Text>

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
  const { email, password, error, loading } = auth;

  return { email, password, error, loading };
};

export default connect(mapStateToProps, {
  emailChanged, passwordChanged, loginUser, clearAuthFieldsBeforeSignup
})(LoginForm);
