import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import firebase from 'react-native-firebase';

class index extends Component {
  render() {
    const Banner = firebase.admob.Banner;
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();
    //this is testID
    // const unitId =
    //   'ca-app-pub-3940256099942544/6300978111';
    const unitId = Platform.OS === 'ios'
      ? 'ca-app-pub-7408150007491403/9385102097'
      : 'ca-app-pub-7408150007491403/2088054241';
    return (
      <View style={{ borderTopWidth: 1, borderTopColor: '#427ef7' }}>
        <Banner
          style={{ top: 0, left: 0 }}
          unitId={unitId}
          size={'SMART_BANNER'}
          request={request.build()}
          onAdLoaded={() => {
          }}
          onAdFailedToLoad={(error) => {
          }}
        />
      </View>
    );
  }
}

export default index;
