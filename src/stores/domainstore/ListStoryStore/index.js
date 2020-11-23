import { Alert } from 'react-native';
import { observable, computed, action } from 'mobx';
import DataService from '../../../service/DataService';
import Config from '../../../config';
import { isEmpty } from '../../../utils';

export default class HomeStore {

    constructor() {
        const firebase = require("firebase");
        this.database = firebase.database();
    }

    @observable
    listStory = [];
    @observable loading = false;

    @action
    getListStory(categoryId) {
        const listStoryDB = DataService.getListData(Config.Constant.STORY, 'categoryId', categoryId);
        if (listStoryDB.length == 0) {
            if (!DataService.getStatusNetword()) {
                Alert.alert('', 'Không có kết nối mạng');
                return;
            }
            this.loading = true;
            this.database.ref('story')
                .orderByChild('categoryId')
                .equalTo(categoryId)
                .on('value', snapshot => {
                    let arr = [];
                    for (let key in snapshot.val()) {
                        arr.push({
                            id: key,
                            ...snapshot.val()[key]
                        });
                    }
                    const listStorySave = arr.map(item => {
                        return {
                            ...item,
                            name: DataService.encryptText(item.name, Config.Constant.MOTHER_FUCKER),
                            urlFile: DataService.encryptText(item.urlFile, Config.Constant.MOTHER_FUCKER),
                            isView: '',
                            id: item.id,
                            categoryId: item.categoryId,
                        };
                    });
                    DataService.saveArrayData(listStorySave, Config.Constant.STORY);
                    this.loading = false;
                    this.listStory = arr;
                })
        } else {
            const listStory = listStoryDB.map(item => {
                return {
                    ...item,
                    name: DataService.decryptText(item.name, Config.Constant.MOTHER_FUCKER),
                    urlFile: DataService.decryptText(item.urlFile, Config.Constant.MOTHER_FUCKER),
                    isView: item.isView,
                    id: item.id,
                    categoryId: item.categoryId,
                }
            })
            this.listStory = listStory;
        }
    }

}