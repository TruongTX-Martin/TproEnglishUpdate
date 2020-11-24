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
