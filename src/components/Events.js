import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, 
         Button, Icon, Footer, FooterTab,
         Text, Tab, Tabs } from 'native-base';
import { Actions  } from 'react-native-router-flux';
import Calendar from 'react-native-calendar';
import moment from 'moment';
import { signOutUser } from '../actions';
import { getAccessToken } from '../Storage';
import { fetchServer } from '../FetchApi';

const config = require('../Config.js');

const customDayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const customMonthNames  = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: moment().format(),
      email: this.props.email,
      accessToken: ''
    };
  }

  componentWillMount() {
    getAccessToken()
    .then(({access_token}) => {
      this.setState({
        accessToken: access_token
      },() => {
        fetchServer(this.state.accessToken)
        .then((res)=>{
          console.log( "fetch server response" );
          console.log( res );
          console.log( this.state.email );
        })
        .catch((err)=>{
          console.log( err );
          this.props.signOutUser(this.state.email);
        });
      });
    })
    .catch((err) => {
      console.log(err);
      this.props.signOutUser(this.state.email);
    });
  }

  render() {
    console.log(this.state.selectedDate);
    return(
      <Container>
        <Header>
          <Title>AskOut</Title>
        </Header>
        <Content>
          <Tabs>
            <Tab heading="Calendar">
            </Tab>
            <Tab heading="Created">
            </Tab>
            <Tab heading="Matched">
            </Tab>
          </Tabs>
        
          <Calendar
            ref="calendar"
            eventDates={['2016-07-03', '2016-07-05', '2016-07-28', '2016-07-30']}
            events={[{date: '2016-07-04', hasEventCircle: {backgroundColor: 'powderblue'}}]}
            scrollEnabled
            showControls
            dayHeadings={customDayHeadings}
            monthNames={customMonthNames}
            titleFormat={'MMMM YYYY'}
            prevButtonText={'Prev'}
            nextButtonText={'Next'}
            onDateSelect={(date) => this.setState({ selectedDate: date })}
            onTouchPrev={(e) => console.log('onTouchPrev: ', e)}
            onTouchNext={(e) => console.log('onTouchNext: ', e)}
            onSwipePrev={(e) => console.log('onSwipePrev: ', e)}
            onSwipeNext={(e) => console.log('onSwipeNext', e)}
          />
          <Text>Selected Date: {moment(this.state.selectedDate).format('MMMM DD YYYY')}</Text>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({auth}) => {
  const { email } = auth;

  return { email };
}

export default connect(mapStateToProps, {signOutUser})(Events);
