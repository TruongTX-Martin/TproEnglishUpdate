/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import NavigationScreen from './Screens/Navigation';
import NetInfo from '@react-native-community/netinfo';
import { EventRegister } from 'react-native-event-listeners';
import Constants from './Config/Constant';
import I18n from 'react-native-i18n';
import './Config/Reactotron';
import DataService from './Services/DataService';
import axios from 'axios';
import KeepAwake from 'react-native-keep-awake';
import { fcmService } from './Services/FCMService';
import moment from 'moment';




//setup default axios
axios.defaults.baseURL = 'https://quizenglishlistening.firebaseio.com/';

export default class App extends Component {
  constructor(props) {
    super(props);
    const firebase = require('firebase');
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyDsHU-qqFd_f_EmcKw0S4r69emcK92hdmw',
        authDomain: 'quizenglishlistening.firebaseapp.com',
        databaseURL: 'https://quizenglishlistening.firebaseio.com',
        projectId: 'quizenglishlistening',
        storageBucket: 'quizenglishlistening.appspot.com',
        messagingSenderId: '185141496389'
      });
    }
  }

  componentDidMount() {
    KeepAwake.activate();
    this.subscribeNetwork = NetInfo.addEventListener((state) => {
      EventRegister.emit(Constants.STATUS_NETWORK, state.isConnected);
    });
    DataService.getLanguage().then(language => {
      if (language != null && language.trim().length > 0) {
        I18n.locale = language;
      }
    })
      .catch(err => console.log('error:', err));
    this.registerTimeNotification();
  }

  async registerTimeNotification() {
    const registerNotifi = await DataService.getRegisterNotification();
    if (registerNotifi == null || registerNotifi == 'null') {
      fcmService.register(
        this.onRegister,
        this.onNotification,
        this.onOpenNotification,
      );
      DataService.setRegisterNotification();
    }
    //set default notification is true
    const notificationStatus = await DataService.getNotificationStatus();
    if (notificationStatus == null) {
      DataService.setNotificationStatus(true);
    }
  }

  onOpenNotification = (notify) => { };

  onNotification = (notify) => {
    const notification = fcmService.buildNotification(
      this.createNotification(notify),
    );
    fcmService.displayNotification(notification);
  };

  onRegister = async (token) => {
    const timeLocal = await DataService.getNotificationTime();
    try {
      if (timeLocal == null) {
        //set time noti default 8h pm
        const timeSet = `Thu Oct 13 2020 19:00:45 GMT${this.getCurrentTimeZone()}`;
        const timeCalendar = new Date(timeSet);
        timeCalendar.setDate(new Date().getDate());
        timeCalendar.setMonth(new Date().getMonth());
        timeCalendar.setFullYear(new Date().getFullYear());
        const timeCalendarString = timeCalendar.toString();
        const indexGTM = timeCalendarString.indexOf('GMT');
        const timeStringSet = timeCalendarString.substr(0, indexGTM + 8);
        DataService.setNotificationTime(timeStringSet);
        this.setReminder(timeStringSet);
      } else {
        const timeCalendar = new Date(timeLocal);
        timeCalendar.setDate(new Date().getDate());
        timeCalendar.setMonth(new Date().getMonth());
        timeCalendar.setFullYear(new Date().getFullYear());
        const timeCalendarString = timeCalendar.toString();
        const indexGTM = timeCalendarString.indexOf('GMT');
        const timeStringSet = timeCalendarString.substr(0, indexGTM + 8);
        this.setReminder(timeStringSet);
      }
    } catch (error) { }
  };

  setReminder = async (notificationTime) => {
    const title = Constants.NOTIFICATION_INFOR.TITLE;
    let description = Constants.NOTIFICATION_INFOR.CONTENT;
    let body = {
      _title: title,
      _body: description,
      _data: {
        title: title,
        body: description,
      },
      _notificationId: Constants.NOTIFICATION_INFOR.ID,
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
    const channelObj = Constants.CHANNEL_OBJECT;
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

  getCurrentTimeZone() {
    // return Math.abs(moment().zone() / 60);
    const offset = moment().utcOffset() / 60;
    let utcZone = '';
    if (offset > 0) {
      if (offset > 9) {
        utcZone = '+' + offset + '00';
      } else {
        utcZone = '+0' + offset + '00';
      }
    } else {
      if (Math.abs(offset) > 9) {
        utcZone = '-' + Math.abs(offset) + '00';
      } else {
        utcZone = '-0' + Math.abs(offset) + '00';
      }
    }
    return utcZone;
  }

  componentWillUnmount() {
    if (this.subscribeNetwork) {
      this.subscribeNetwork();
    }
  }

  networkConnectionChange = (isConnected) => {
    EventRegister.emit(Constants.STATUS_NETWORK, isConnected);
  }
  render() {
    return <NavigationScreen />;
  }
}
