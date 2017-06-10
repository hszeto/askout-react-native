import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signOutUser } from '../actions';
import { Container, Content } from 'native-base';

class SignOut extends Component {
  componentWillMount() {
    const { email } = this.props;

    this.props.signOutUser( email );
  }

  render() {
    return(
      <Container>
        <Content>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { email } = auth;

  return { email };
};

export default connect(mapStateToProps, { signOutUser })(SignOut);
