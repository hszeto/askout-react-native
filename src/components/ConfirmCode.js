import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content,
         Card, CardItem, Button, Text,
         InputGroup, Input, Spinner } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { codeChanged, codeConfirmation, codeResend } from '../actions';

class ConfirmCode extends Component {
  onCodeChange = (text) => {
    this.props.codeChanged(text);
  };

  onCodeButtonPress = () => {
    const { email, code } = this.props;

    this.props.codeConfirmation({ email, code });
  };

  onCodeResendButtonPress = () => {
    const { email } = this.props;

    this.props.codeResend({ email });
  }

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <CardItem>
              <InputGroup borderType='regular'>
                <Input
                  placeholder='Code'
                  onChangeText={this.onCodeChange}
                  value={this.props.code}
                />
              </InputGroup>
            </CardItem>
            <Grid>
              <Col>
                <Button onPress={this.onCodeButtonPress}>
                  <Text>Submit</Text>
                </Button>
              </Col>
              <Col></Col>
              <Col>
                <Button onPress={this.onCodeResendButtonPress}>
                  <Text>Resend Code</Text>
                </Button>
              </Col>
            </Grid>
          </Card>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { email, code, message, loading } = auth;

  return { email, code, message, loading };
};

export default connect(mapStateToProps, {
  codeChanged, codeConfirmation, codeResend
})(ConfirmCode);
