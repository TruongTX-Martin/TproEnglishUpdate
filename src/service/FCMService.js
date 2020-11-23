import { Alert } from 'react-native';
import firebase from 'react-native-firebase';
import Constants from '../config/Constant';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNoitificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  checkPermission = (onRegister) => {
    firebase
      .messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          //user has permission
          this.getToken(onRegister);
        } else {
          //user don't have permission
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log('Permission rejected', error);
      });
  };

  getToken = (onRegister) => {
    firebase
      .messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('User does not have a device token');
        }
      })
      .catch((error) => {
        console.log('getToken rejected ', error);
      });
  };

  requestPermission = (onRegister) => {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        Alert.alert(
          '',
          'Nếu bạn muốn nhận thông báo hãy vào phần Cài đặt ứng dụng vào cho phép nhận thông báo hoặc gỡ app ra và cài lại!',
        );
      });
  };

  deletedToken = () => {
    firebase
      .messaging()
      .deleteToken()
      .catch((error) => {
        console.log('Delected token error ', error);
      });
  };

  createNoitificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // Triggered  when a particular  notification  has been recevied in foreground
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        onNotification(notification);
      });

    // If your app is backgound, you can listen for when a
    //notification is clicked / tapped / opened as follows
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        if (notificationOpen) {
          const notification = notificationOpen.notification;
          onOpenNotification(notification);
          this.removeDelieveredNotification(notification);
        }
      });

    // if your app is closed, you can check if  it was opened by notification
    // being  clicked / tapped / opened as follows
    firebase
      .notifications()
      .getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          const notification = notificationOpen.notification;
          onOpenNotification(notification);
          this.removeDelieveredNotification(notification);
        }
      });

    // Triggered for data only payload  in foreground
    this.messageListener = firebase.messaging().onMessage((message) => {
      onNotification(message);
    });

    // Triggered when have  new token
    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh((fcmToken) => {
        onRegister(fcmToken);
      });
  };

  unRegister = () => {
    this.notificationListener();
    this.notificationOpenedListener();
    this.messageListener();
    this.onTokenRefreshListener();
  };

  buildChannel = (obj) => {
    return new firebase.notifications.Android.Channel(
      obj.channelId,
      obj.channelName,
      firebase.notifications.Android.Importance.High,
    ).setDescription(obj.channelDes);
  };

  buildNotification = (obj) => {
    firebase.notifications().android.createChannel(obj.channel);

    const notification = new firebase.notifications.Notification()
      .setSound(obj.sound)
      .setNotificationId(obj.dataId)
      .setTitle(obj.title)
      .setBody(obj.content)
      .setData(obj.data)
      .android.setChannelId(obj.channel.channelId)
      .android.setLargeIcon(obj.largeIcon)
      .android.setSmallIcon(obj.smallIcon)
      .android.setColor(obj.colorBgIcon)
      .android.setPriority(firebase.notifications.Android.Priority.High)
      .android.setVibrate(obj.vibrate)
      .android.setAutoCancel(true);
    return notification;
  };

  scheduleNotification = (notification, datetime) => {
    const date = new Date(datetime);
    this.removeDelieveredNotification(Constants.NOTIFICATION_INFOR.ID);
    firebase.notifications().scheduleNotification(notification, {
      fireDate: date.getTime(),
      repeatInterval: 'day',
      exact: true,
    });
  };

  displayNotification = (notification) => {
    firebase
      .notifications()
      .displayNotification(notification)
      .catch((error) => {
        console.log('Display Notification error', error);
      });
  };

  removeDelieveredNotification = (notificationId) => {
    firebase.notifications().cancelNotification(notificationId);
  };
}

export const fcmService = new FCMService();
