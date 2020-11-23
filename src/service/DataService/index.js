import Realm from '../../modal';
import Constants from '../../config/Constant';
var CryptoJS = require("crypto-js");
import ENC from 'crypto-js/enc-utf8'
import AsyncStorage from '@react-native-community/async-storage';



let connected = true;
let showAdmobDetail = false;

const deleteData = tableName => {
  try {
    Realm.write(() => {
      let allData = Realm.objects(tableName);
      Realm.delete(allData);
    });
  } catch (error) {
    console.log('Error when delete data:', error);
  }
};
const saveArrayData = (listData, tableName) => {
  if (listData.length === 0) return;
  try {
    deleteData(tableName);
    Realm.write(() => {
      listData.map(item => {
        Realm.create(tableName, item);
      });
    });
  } catch (error) {
    console.log('Something wrong when save data:', error);
  }
};

const updateStory = (storyId) => {
  try {
    Realm.write(() => {
      let data = Realm.objects('Story').filtered(`id= "${storyId}"`);
      if (Object.keys(data).length > 0) {
        let item = data[0];
        item.isView = 'true';
        Realm.create('Story', item, true);
      }
    });
  } catch (error) {
    console.log('Update lesson failed:', error);
  }
};
const getData = tableName => {
  return Realm.objects(tableName);
};

const getListData = (tableName, field, value) => {
  return Realm.objects(tableName).filtered(`${field} = '${value}'`);
};

const encryptText = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString();
}
const decryptText = (text, key) => {
  return CryptoJS.AES.decrypt(text, key).toString(ENC);
}

const setStatusNetword = (status) => {
  connected = status;
}

const getStatusNetword = () => {
  return connected;
}

const setShowAdmobDetail = (show) => {
  showAdmobDetail = show;
  const timeout = setTimeout(() => {
    showAdmobDetail = false;
    clearTimeout(timeout);
  }, 1000 * 60 * 30);
}

const getShowAdmobDetail = () => {
  return showAdmobDetail;
}

const setRegisterNotification = () => {
  try {
    AsyncStorage.setItem(Constants.STORAGE_REGISTER_NOTIFICATION, 'true');
  } catch (error) { }
};
const getRegisterNotification = async () => {
  return await AsyncStorage.getItem(Constants.STORAGE_REGISTER_NOTIFICATION);
};

const setNotificationStatus = (time) => {
  try {
    AsyncStorage.setItem(Constants.PUSH_NOTIFICATION_STATUS, time.toString());
  } catch (error) { }
};
const getNotificationStatus = async () => {
  return await AsyncStorage.getItem(Constants.PUSH_NOTIFICATION_STATUS);
};

const setNotificationTime = (time) => {
  try {
    AsyncStorage.setItem(Constants.PUSH_NOTIFICATION_TIME, time.toString());
  } catch (error) { }
};
const getNotificationTime = async () => {
  return await AsyncStorage.getItem(Constants.PUSH_NOTIFICATION_TIME);
};

const dataService = {
  getData,
  saveArrayData,
  getListData,
  encryptText,
  decryptText,
  setStatusNetword,
  getStatusNetword,
  setShowAdmobDetail,
  getShowAdmobDetail,
  setRegisterNotification,
  getRegisterNotification,
  setNotificationStatus,
  getNotificationStatus,
  setNotificationTime,
  getNotificationTime,
  updateStory,
};

export default dataService;