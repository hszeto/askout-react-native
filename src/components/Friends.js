import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, 
         Button, Icon, List, ListItem,
         Text, Tab, Tabs } from 'native-base';
import { Actions  } from 'react-native-router-flux';

class Friends extends Component {
  render() {
    const emails = ["Man C B B","George Szeto","Chris Yang","Kenny Lau","Simon Kwok"];
    return(
      <Container>
        <Header>
          <Title>AskOut</Title>
        </Header>
        <Tabs>
          <Tab heading="Friends">
          </Tab>
          <Tab heading="Requests">
          </Tab>
          <Tab heading="Find Friends">
          </Tab>
        </Tabs>

        <Content>
          <List dataArray={emails}
            renderRow={(email) =>
              <ListItem>
                <Text>{email}</Text>
              </ListItem>
            }>
          </List>
        </Content>
      </Container>
    );
  }
}

export default connect(null, {})(Friends);
