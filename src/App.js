/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import './config/Reactotron';
import axios from 'axios';
import MyApp from './screens/Navigation';
import SplashScreen from 'react-native-splash-screen';
import Constants from './config/Constant';
import { Provider } from "mobx-react";
import NetInfo from '@react-native-community/netinfo';
import { EventRegister } from 'react-native-event-listeners';
import DataService from './service/DataService';
import KeepAwake from 'react-native-keep-awake';
import stores from "./stores";
import { fcmService } from './service/FCMService';
import moment from 'moment';


//setup default axios
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';

export default class App extends Component {

  constructor(props) {
    super(props);
    const firebase = require('firebase');
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: Constants.FIREBASE_CONFIG_AUDIO.apiKey,
        authDomain: Constants.FIREBASE_CONFIG_AUDIO.authDomain,
        databaseURL: Constants.FIREBASE_CONFIG_AUDIO.databaseURL,
        projectId: Constants.FIREBASE_CONFIG_AUDIO.projectId,
        storageBucket: Constants.FIREBASE_CONFIG_AUDIO.storageBucket,
        messagingSenderId: Constants.FIREBASE_CONFIG_AUDIO.messagingSenderId,
        appId: Constants.FIREBASE_CONFIG_AUDIO.appId
      });
    }
  }


  componentDidMount() {
    KeepAwake.activate();
    SplashScreen.hide();
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

  onNotification = (notify) => {
    const notification = fcmService.buildNotification(
      this.createNotification(notify),
    );
    fcmService.displayNotification(notification);
  };

  onOpenNotification = (notify) => { };

  onRegister = async (token) => {
    const timeLocal = await DataService.getNotificationTime();
    try {
      if (timeLocal == null) {
        //set time noti default 8h pm
        const timeSet = `Thu Oct 13 2020 20:00:45 GMT${this.getCurrentTimeZone()}`;
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

  componentWillMount() {
    this.subscribeNetwork = NetInfo.addEventListener((state) => {
      DataService.setStatusNetword(state.isConnected);
      EventRegister.emit(Constants.STATUS_NETWORK, state.isConnected);
    });
  }
  componentWillUnmount() {
    if (this.subscribeNetwork) {
      this.subscribeNetwork();
    }
  }
  render() {
    return (
      <Provider {...stores}>
        <MyApp />
      </Provider>
    );
  }
}

