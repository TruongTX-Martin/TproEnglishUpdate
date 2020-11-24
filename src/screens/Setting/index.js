import React, { Component } from 'react';
import { Container, Body, Header, Footer, Content } from 'native-base';
import {
  View,
  Text,
  Dimensions,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native';
import HeaderBase from '../../Components/HeaderBase';
import Config from '../../Config';
import DataService from '../../Services/DataService';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { EventRegister } from 'react-native-event-listeners';
import moment from 'moment';
import { showToast, showInterstitialAd } from '../../utils';
import { fcmService } from '../../Services/FCMService';
import BannerAd from '../../Components/AdmobBanner';
const { width, height } = Dimensions.get('window');

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnableNoti: true,
      isDateTimePickerVisible: false,
      notificationTime: moment(),
      connected: true,
    };
  }

  componentDidMount() {
    this.getTimeLocal();
    // this.eventNetworkStatus = EventRegister.addEventListener(
    //   Config.Constant.EVENT_NETWORK_UPDATE,
    //   (connected) => {
    //     this.setState({ connected });
    //   },
    // );
  }

  componentWillUnmount() {
    // EventRegister.removeEventListener(this.eventNetworkStatus);
  }

  async getTimeLocal() {
    const timeNotiLocal = await DataService.getNotificationTime();
    const newTime = moment(timeNotiLocal);
    const notificationStatus = await DataService.getNotificationStatus();
    this.setState({
      notificationTime: newTime,
      isEnableNoti: notificationStatus == 'true' ? true : false,
    });
  }

  toggleSwitch = () => {
    this.setState(
      (prevState) => ({
        isEnableNoti: !prevState.isEnableNoti,
      }),
      () => {
        DataService.setNotificationStatus(this.state.isEnableNoti);
        showInterstitialAd();
        if (!this.state.isEnableNoti) {
          fcmService.removeDelieveredNotification(
            Config.Constant.NOTIFICATION_INFOR.ID,
          );
        } else {
          this.setReminder();
        }
      },
    );
  };

  displayDateTimePicker = () => {
    const { isEnableNoti } = this.state;
    if (!isEnableNoti) {
      showToast('Bật nhắc nhở để đặt thời gian.');
      return;
    }
    this.setState({ isDateTimePickerVisible: true });
  };

  closeDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handlePicked = (date) => {
    this.closeDateTimePicker();
    showInterstitialAd();
    this.setState(
      {
        notificationTime: moment(date),
      },
      () => this.setReminder(),
    );
  };

  setReminder = async () => {
    const { notificationTime, isEnableNoti } = this.state;
    if (!isEnableNoti) {
      return;
    }
    DataService.setNotificationTime(notificationTime);
    const title = Config.Constant.NOTIFICATION_INFOR.TITLE;
    let description = Config.Constant.NOTIFICATION_INFOR.CONTENT;
    let body = {
      _title: title,
      _body: description,
      _data: {
        title: title,
        body: description,
      },
      _notificationId: Config.Constant.NOTIFICATION_INFOR.ID,
      time: notificationTime,
    };
    this.scheduleReminder(body);
  };

  scheduleReminder = (notifyDetails) => {
    const notification = fcmService.buildNotification(
      this.createNotification(notifyDetails),
    );
    fcmService.scheduleNotification(notification, notifyDetails.time);
  };

  createNotification = (notify) => {
    const channelObj = Config.Constant.CHANNEL_OBJECT;
    const channel = fcmService.buildChannel(channelObj);
    const buildNotify = {
      title: notify._title,
      content: notify._body,
      sound: 'default',
      channel: channel,
      data: notify._data,
      colorBgIcon: '#1A243B',
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_launcher',
      vibrate: true,
      dataId: notify._notificationId,
    };
    return buildNotify;
  };

  render() {
    const {
      isEnableNoti,
      isDateTimePickerVisible,
      notificationTime,
      connected
    } = this.state;
    const timeCalendar = new Date(notificationTime);
    timeCalendar.setDate(new Date().getDate());
    timeCalendar.setMonth(new Date().getMonth());
    timeCalendar.setFullYear(new Date().getFullYear());
    return (
      <Container>
        <Header style={Config.Styles.header}>
          <HeaderBase title={'Cài đặt'} navigation={this.props.navigation} />
        </Header>
        <Body>
          <Content showsVerticalScrollIndicator={false}>
            <View style={{ width, height, backgroundColor: '#eaeaea' }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    color: 'black',
                    fontWeight: '700',
                    marginLeft: 10,
                  }}>
                  Nhắc nhở học tiếng anh hàng ngày
                                </Text>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: 20,
                  }}>
                  <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isEnableNoti ? '#427ef7' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={this.toggleSwitch}
                    value={isEnableNoti}
                  />
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: isEnableNoti ? 'bold' : 'normal',
                      fontSize: 13,
                      marginTop: Platform.OS == 'ios' ? 0 : -5,
                    }}>
                    {isEnableNoti ? 'Bật' : 'Tắt'}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: width - 20,
                  height: 0.5,
                  backgroundColor: '#cacaca',
                  marginLeft: 10,
                  marginVertical: 5,
                }}
              />
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}
                onPress={() => this.displayDateTimePicker()}>
                <Text
                  style={{
                    fontSize: 17,
                    color: 'black',
                    fontWeight: '700',
                    marginLeft: 10,
                  }}>
                  Thời gian
                </Text>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: 20,
                  }}>
                  <Text
                    style={{
                      color: '#427ef7',
                      fontWeight: '700',
                      fontSize: 17,
                    }}>
                    {moment(notificationTime).format('LT')}
                  </Text>
                </View>
                <DateTimePicker
                  isVisible={isDateTimePickerVisible}
                  onConfirm={this.handlePicked}
                  onCancel={this.closeDateTimePicker}
                  mode="time"
                  is24Hour={false}
                  date={timeCalendar}
                  titleIOS="Chọn thời gian bạn muốn nhắc nhở"
                />
              </TouchableOpacity>
              <View
                style={{
                  width,
                  height: 1,
                  backgroundColor: '#cacaca',
                  marginVertical: 10,
                }}
              />
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#CACACA',
                  width: width - 20,
                  marginHorizontal: 10,
                  marginTop: 10,
                  borderRadius: 5,
                  padding: 10
                }}
              >
                <Text style={{ fontSize: 16, marginTop: 3, color: '#00ADD8' }}>
                  Copyright @ 1998-2019.
                </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://esl-lab.com/randall.htm')}>
                  <Text style={{ fontSize: 16, marginTop: 3, color: '#FF0099' }}>
                    Randall Davis.
                  </Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, marginTop: 3, color: '#00ADD8' }}>
                  All rights reserved.
                </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://esl-lab.com/copy.htm')}>
                  <Text style={{ fontSize: 16, marginTop: 3, color: '#FF0099' }}>
                    Read complete Terms of Use for more information.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Content>
        </Body>
        {connected && (
          <Footer
            style={{
              backgroundColor: '#000000',
              borderTopColor: '#427ef7',
              borderTopWidth: 1,
            }}>
            <BannerAd />
          </Footer>
        )}
      </Container>
    );
  }
}

export default index;
