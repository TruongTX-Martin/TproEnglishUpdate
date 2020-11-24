import React, { Component } from 'react';
import { Button } from 'native-base';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Images from '../../Assets/Images';
import styles from './style';

class index extends Component {
  render() {
    return (
      <View style={styles.parrentView}>
        <View style={styles.viewLeft}>
          {this.props.navigation && (
            <TouchableOpacity
              transparent
              style={styles.buttonLeft}
              onPress={() => {
                this.props.navigation.goBack();
                this.props.goBack ? this.props.goBack() : null
              }}
            >
              <Image
                style={styles.imageButtonLeft}
                source={Images.imageArrowLeftWhite}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.viewCenter}>
          <Text style={styles.textCenter}>{this.props.title}</Text>
        </View>
        <View style={styles.viewRight}>
          {this.props.showSetting && (
            <TouchableOpacity onPress={() => this.props.openSetting ? this.props.openSetting() : null}>
              <Image
                style={{ width: 30, height: 30 }}
                source={Images.imageSettingWhite}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

export default index;
