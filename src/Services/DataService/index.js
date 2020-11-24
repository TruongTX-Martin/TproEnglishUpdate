import Realm from '../../Modal';
import { AsyncStorage } from 'react-native';
import Constants from '../../Config/Constant';
var CryptoJS = require("crypto-js");
import ENC from 'crypto-js/enc-utf8'

const getData = tableName => {
  return Realm.objects(tableName);
};

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

//for lesson

const getListData = (tableName, field, value) => {
  return Realm.objects(tableName).filtered(`${field} = '${value}'`);
};

const saveListLesson = listData => {
  if (!listData || listData.length === 0) return;
  Realm.write(() => {
    listData.map(item => {
      let data = Realm.objects(Constants.LESSON).filtered(`id= "${item.id}"`);
      if (Object.keys(data).length === 0) {
        Realm.create(Constants.LESSON, item);
      }
    });
  });
};

const updateLesson = (lesson, total, score) => {
  try {
    Realm.write(() => {
      let data = Realm.objects(Constants.LESSON).filtered(`id= "${lesson.id}"`);
      if (Object.keys(data).length > 0) {
        let item = data[0];
        item.isSubmit = true;
        item.total = total;
        item.score = score;
        Realm.create(Constants.LESSON, item, true);
      }
    });
  } catch (error) {
    console.log('Update lesson failed:', error);
  }
};

const addNewWord = newWord => {
  try {
    const lessons = Realm.objects(Constants.NEWWORD).filtered(`title="${newWord.title}"`);
    if (Object.keys(lessons).length === 0) {
      Realm.write(() => {
        Realm.create(Constants.NEWWORD, newWord);
      });
      return true;
    }
    return false;
  } catch (error) {
    console.log('Error when add new word:', error);
  }
};

const getNewWordByLesson = lesson => {
  const lessons = Realm.objects(Constants.NEWWORD).filtered(`lessonId="${lesson.id}"`);
  const newArr = [];
  for (let i = 0; i < lessons.length; i++) {
    const item = lessons[i];
    newArr.push({
      ...item
    })
  }
  return newArr;
};

const getMyWords = () => {
  const lessons = Realm.objects(Constants.NEWWORD).filtered(`isMyWord=true`);
  const newArr = [];
  for (let i = 0; i < lessons.length; i++) {
    const item = lessons[i];
    newArr.push({
      ...item
    })
  }
  return newArr;
};

const getMyWrongWords = () => {
  const lessons = Realm.objects(Constants.NEWWORD).filtered(`isWrong=true`);
  const newArr = [];
  for (let i = 0; i < lessons.length; i++) {
    const item = lessons[i];
    newArr.push({
      ...item
    })
  }
  return newArr;
};

const deleteNewWord = newWord => {
  try {
    Realm.write(() => {
      let allData = Realm.objects(Constants.NEWWORD).filtered(
        `id="${newWord.id}"`
      );
      Realm.delete(allData);
    });
  } catch (error) {
    console.log('Error when delete data:', error);
  }
};

const updateNewWord = (newWord, title, meaning, note) => {
  try {
    if (newWord.title === title) {
      Realm.write(() => {
        let data = Realm.objects(Constants.NEWWORD).filtered(
          `id="${newWord.id}"`
        );
        if (Object.keys(data).length > 0) {
          let item = data[0];
          item.title = title;
          item.meaning = meaning;
          item.note = note;
          Realm.create(Constants.NEWWORD, item, true);
        }
      });
      return true;
    } else {
      const lessons = Realm.objects(Constants.NEWWORD).filtered(`title="${title}"`);
      if (Object.keys(lessons).length === 0) {
        Realm.write(() => {
          let data = Realm.objects(Constants.NEWWORD).filtered(
            `id="${newWord.id}"`
          );
          if (Object.keys(data).length > 0) {
            let item = data[0];
            item.title = title;
            item.meaning = meaning;
            item.note = note;
            Realm.create(Constants.NEWWORD, item, true);
          }
        });
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log('Error when update new word:', error);
  }
};

const addToMyWord = (newWord) => {
  try {
    Realm.write(() => {
      let data = Realm.objects(Constants.NEWWORD).filtered(
        `id="${newWord.id}"`
      );
      if (Object.keys(data).length > 0) {
        let item = data[0];
        item.isMyWord = true;
        Realm.create(Constants.NEWWORD, item, true);
      }
    });
  } catch (error) {
    console.log('Error when update new word:', error);
  }
};

const removeFromMyWord = (newWord) => {
  try {
    Realm.write(() => {
      let data = Realm.objects(Constants.NEWWORD).filtered(
        `id="${newWord.id}"`
      );
      if (Object.keys(data).length > 0) {
        let item = data[0];
        item.isMyWord = false;
        Realm.create(Constants.NEWWORD, item, true);
      }
    });
  } catch (error) {
    console.log('Error when update new word:', error);
  }
};

const addToMyWordWrong = (newWord, isAdd) => {
  try {
    Realm.write(() => {
      let data = Realm.objects(Constants.NEWWORD).filtered(
        `id="${newWord.id}"`
      );
      if (Object.keys(data).length > 0) {
        let item = data[0];
        item.isWrong = isAdd;
        Realm.create(Constants.NEWWORD, item, true);
      }
    });
  } catch (error) {
    console.log('Error when update new word:', error);
  }
};

const setFirstTime = async (isFirst) => {
  try {
    await AsyncStorage.setItem(Constants.ISFIRST, isFirst);
  } catch (error) {
    console.log(error);
  }
};

const getFirstTime = async () => {
  try {
    const first = await AsyncStorage.getItem(Constants.ISFIRST);
    if (first !== null) {
      return first;
    }
    return '';
  } catch (error) {
    return '';
  }
};

const setLanguage = async (language) => {
  try {
    await AsyncStorage.setItem(Constants.ASYN_LANGUAGE, language);
  } catch (error) {
  }
};

const getLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(Constants.ASYN_LANGUAGE);
    if (language !== null) {
      return language;
    }
    return '';
  } catch (error) {
    return '';
  }
};

const encryptText = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString();
}
const decryptText = (text, key) => {
  return CryptoJS.AES.decrypt(text, key).toString(ENC);
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
  deleteData,
  saveArrayData,
  getListData,
  saveListLesson,
  updateLesson,
  addNewWord,
  getNewWordByLesson,
  updateNewWord,
  addToMyWord,
  deleteNewWord,
  setLanguage,
  getLanguage,
  getMyWords,
  getMyWrongWords,
  addToMyWordWrong,
  removeFromMyWord,
  encryptText,
  decryptText,
  setFirstTime,
  getFirstTime,
  setRegisterNotification,
  getRegisterNotification,
  setNotificationStatus,
  getNotificationStatus,
  setNotificationTime,
  getNotificationTime,
};

export default dataService;
