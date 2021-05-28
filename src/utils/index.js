import firebase from 'react-native-firebase';
import Toast from 'react-native-simple-toast';

export const isEmpty = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};

export const showInterstitialAd = (callbackClose) => {
    // const unitId = 'ca-app-pub-3940256099942544/1033173712';
    const unitId =
        Platform.OS === 'ios'
            ? 'ca-app-pub-4551292767712620/7619125984'
            : 'ca-app-pub-4551292767712620/4035104194';
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
