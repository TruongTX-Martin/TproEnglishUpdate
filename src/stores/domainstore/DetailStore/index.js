import {observable, computed, action, get} from 'mobx';
import {
    View, Platform, Dimensions,
    PermissionsAndroid,
    NativeModules,
    Alert
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
const PermissionSetting = NativeModules.PermissionSetting;
const PATH_DOWNLOAD = RNFetchBlob.fs.dirs.DocumentDir + '/biblestory/';
const PATH_DOWNLOAD_ANDROID = RNFetchBlob.fs.dirs.DCIMDir + '/biblestory/';
import DataService from '../../../service/DataService';
import Config from '../../../config';
import { isEmpty } from '../../../utils';

export default class HomeStore {

    constructor(){
        const firebase = require("firebase");
        this.database = firebase.database();
    }

    @observable 
    urlFile = '';
    @observable loading = false;

    @observable listStoryShowAdmob = [];

    @observable hasShowedAdmob = false;

    @action checkStoryIdIsShowAdmob(storyId){
        const exits = this.listStoryShowAdmob.includes(storyId);
        if(!exits){
            this.listStoryShowAdmob.push(storyId);
        }
        return exits;
    }

    @action setHasShowAdmob(isShow){
        this.hasShowedAdmob = isShow;
    }

    @action getShowAdmobStatus(){
        return this.hasShowedAdmob;
    }

    @action 
    checkFileHasDownloaded(url){
        const fileName = this.getNameFromUrl(url);
        const pathDownload = Platform.OS === 'android' ? PATH_DOWNLOAD_ANDROID : PATH_DOWNLOAD;
        const pathSave = pathDownload + fileName;
        RNFetchBlob.fs.exists(pathSave)
            .then((exist) => {
                if (exist) {
                    this.urlFile = pathSave;
                } else {
                    this.handleDownloadFilePdf(url);
                }
            })
            .catch(err => {
                console.log('Error:', err);
            })
    }

    async handleDownloadFilePdf(url) {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.startDownload(url);
                } else {
                    Alert.alert(
                        '',
                        'Cho phép tải file xuống máy để bạn có thể xem nội dung. Nhấn Ok -> Permision -> Storage', [{
                            text: 'Huỷ',
                        }, {
                            text: 'Ok',
                            onPress: () => PermissionSetting.openPermissonApp()
                        },], {
                            cancelable: false
                        }
                    )
                }
            } catch (error) {
                console.warn('Request permision error:', error);
            }
        } else {
            this.startDownload(url);
        }
    }

    startDownload(url) {
        const fileName = this.getNameFromUrl(url);
        const pathDownload = Platform.OS === 'android' ? PATH_DOWNLOAD_ANDROID : PATH_DOWNLOAD;
        const pathSave = pathDownload + fileName;
        this.downloading = true;
        RNFetchBlob.config({
            fileCache: true,
            path: pathSave,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                description: 'Downloading file',
                path: pathSave
            },
        }).fetch('GET', url)
            .then(response => {
                this.downloading = false;
                this.urlFile  = pathSave;
            }).catch(error => {
                this.downloading = false;
            })
    }

    getNameFromUrl(url) {
        if (url.includes('%2F')) {
            url = url.replace('%2F', '/');
        }
        try {
            return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('?'));
        } catch (error) {
        }
        return '';
    }

}