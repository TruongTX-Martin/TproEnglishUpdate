import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
// import {
//   AdMobBanner
// } from 'react-native-admob';
class index extends Component {


  render() {
    return (
      <View>
        {/* <AdMobBanner
          adSize="smartBannerLandscape||smartBannerPortrait"
          adUnitID={Platform.OS === 'android' ? 'ca-app-pub-7408150007491403/9999770378' : 'ca-app-pub-7408150007491403/4718304945'}
          testDevices={[AdMobBanner.simulatorId]}
          onAdFailedToLoad={error => console.log('Load admob error:', error)}
        /> */}
      </View>
    );
  }
}

export default index;
