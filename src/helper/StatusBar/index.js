import { Dimensions, Platform, StatusBar } from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get('window');

let isIPhoneX = false;

if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
  isIPhoneX =
    (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) ||
    (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT);
}

const HEADER_ANDROID  = 56;
const HEADER_IOS = 64;
const FOOTER = 55;
const STATUSBAR_IPHONEX =  24 + 33 ;//top 44- 20, bottom 33

export const getTopAndBottomHeight = () => {
  return Platform.select({
    ios: isIPhoneX ? HEADER_IOS + FOOTER + STATUSBAR_IPHONEX : HEADER_IOS + FOOTER ,
    android: HEADER_ANDROID + FOOTER +  StatusBar.currentHeight,
    default: HEADER_ANDROID + FOOTER +  StatusBar.currentHeight
  });
};

const IPHONE_STATUS_BAR = 20;
const IPHONEX_STATUS_BAR  = 44;


export const getStatusBarHeight = () => {
  return Platform.select({
    ios: isIPhoneX ? IPHONEX_STATUS_BAR : IPHONE_STATUS_BAR,
    android: 0,
    default: 0
  });
};

export const getHeightCenterWithHeaderFooter = () => {
  return Platform.select({
    ios: isIPhoneX ? IPHONEX_STATUS_BAR : IPHONE_STATUS_BAR,
    android: W_HEIGHT -20,
    default: 0
  });
};

