import Config from 'react-native-config';

export default constant = {
    DETAIL: 'Detail',
    CATEGORY: 'Category',
    STORY: 'Story',
    STORY: 'Story',
    ID: 'id',
    STRING: 'string',
    MOTHER_FUCKER: 'intstring',
    STATUS_NETWORK: 'statusNetwork',
    EVENT_RELOAD_DATA: 'EVENT_RELOAD_DATA',
    FIREBASE_CONFIG_AUDIO: {
        apiKey: Config.API_KEY,
        authDomain: Config.AUTH_DOMAIN,
        databaseURL: Config.DATABASE_URL,
        projectId: Config.PROJECT_ID,
        storageBucket: Config.STORAGE_BUCKET,
        messagingSenderId: Config.MESSAGING_SENDERID,
        appId: Config.APPID,
    },
    NOTIFICATION_INFOR: {
        ID: 'NotificationID_BibleStory',
        TITLE: 'Truyện Kinh Thánh',
        CONTENT:
            'Hãy đọc truyện kinh thánh cho con trẻ hàng ngày.',
    },
    STORAGE_REGISTER_NOTIFICATION: '@bible_story_register_notification',
    PUSH_NOTIFICATION_STATUS: '@bible_story_PUSH_NOTIFICATION_STATUS',
    PUSH_NOTIFICATION_TIME: '@bible_PUSH_NOTIFICATION_TIME',
    CHANNEL_OBJECT: {
        channelId: 'BibleStoryChannelID',
        channelName: 'BibleStoryChannelName',
        channelDes: 'BibleStoryChannelDes',
    },
}