import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import firebase from 'react-native-firebase';

class index extends Component {
  render() {
    const Banner = firebase.admob.Banner;
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();
    //this is testID
    // const unitId = 'ca-app-pub-3940256099942544/6300978111';
    const unitId =
      Platform.OS === 'ios'
        ? 'ca-app-pub-4551292767712620/3133086063'
        : 'ca-app-pub-4551292767712620/4226675889';
    return (
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#427ef7',
          borderBottomWidth: 1,
          borderBottomColor: '#427ef7',
        }}>
        <Banner
          style={{ top: 0, left: 0 }}
          unitId={unitId}
          size={'SMART_BANNER'}
          request={request.build()}
          onAdLoaded={() => { }}
          onAdFailedToLoad={(error) => {
            console.log('onAdFailedToLoad:', error);
          }}
        />
      </View>
    );
  }
}

export default index;
