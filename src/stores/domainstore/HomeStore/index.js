import { Alert } from 'react-native';
import { observable, computed, action } from 'mobx';
import DataService from '../../../service/DataService';
import Config from '../../../config';
import Constants from '../../../config/Constant';
import { isEmpty } from '../../../utils';

export default class HomeStore {

    constructor() {
        const firebase = require("firebase");
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
        this.database = firebase.database();
    }

    @observable
    listCategory = [];
    @observable loading = false;

    @action
    getListCategory() {
        const list = DataService.getData(Config.Constant.CATEGORY);
        if (list.length == 0) {
            if (!DataService.getStatusNetword()) {
                Alert.alert('', 'Không có kết nối mạng');
                return;
            }
            this.loading = true;
            this.database.ref('category')
                .on('value', snapshot => {
                    let arr = [];
                    for (let key in snapshot.val()) {
                        arr.push({
                            id: key,
                            ...snapshot.val()[key]
                        });
                    }
                    DataService.saveArrayData(arr, Config.Constant.CATEGORY);
                    this.loading = false;
                    this.listCategory = arr;
                })
        } else {
            this.listCategory = list;
        }
    }

}