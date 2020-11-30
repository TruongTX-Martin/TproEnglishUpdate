import firebase from 'react-native-firebase';
import Toast from 'react-native-simple-toast';

export const isEmpty = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


export const showInterstitialAd = (callbackClose) => {
    // const unitId = 'ca-app-pub-3940256099942544/1033173712';g
    const unitId =
        Platform.OS === 'ios'
            ? 'ca-app-pub-7408150007491403/6266988314'
            : 'ca-app-pub-7408150007491403/3912287710';
    const advert = firebase.admob().interstitial(unitId);
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();
    advert.loadAd(request.build());
    advert.on('onAdLoaded', () => {
        advert.show();
    });
    advert.on('onAdClosed', () => {
        callbackClose && callbackClose();
    });
};

export const capitalize = (s) => {
    if (typeof s !== 'string') {
        return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

export const showToast = (message) => {
    Toast.showWithGravity(message, Toast.LONG, Toast.CENTER);
};