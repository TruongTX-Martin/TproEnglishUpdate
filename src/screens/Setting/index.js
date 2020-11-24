import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions, Linking, BackHandler } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Container, Body, Content, Header, Footer, Button } from 'native-base';
import Config from '../../Config';
import HeaderBase from '../../Components/HeaderBase';
import Images from '../../Assets/Images';
import Constants from '../../Config/Constant';
import { EventRegister } from 'react-native-event-listeners';
import DataService from '../../Services/DataService';
import I18n from 'react-native-i18n';
import { Localizations } from '../../i18n';
import AdmobBanner from '../../Components/AdmobBanner';


var { height, width } = Dimensions.get('window');
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: Constants.SettingScreen.ENGLISH_VALUE,
      connected: props.navigation.state.params.connected
    };
    this.optionsLanguage = [
      Constants.SettingScreen.VIETNAM_LABEL,
      Constants.SettingScreen.ENGLISH_LABEL,
      Constants.SettingScreen.CANCEL
    ];
  }

  componentDidMount() {
    this.getLanguage();
  }

  getLanguage() {
    DataService.getLanguage().then(language => {
      if(language != null && language.trim().length > 0) {
        I18n.locale = language;
        this.setState({ language });
      }else{
        const locale = I18n.currentLocale();
        if(locale === 'vi-VN'){
          I18n.locale = Constants.SettingScreen.VIETNAM_VALUE;
          this.setState({ language : Constants.SettingScreen.VIETNAM_VALUE });
        }
      }
    }).catch(err => console.log('Error:', err));
  }

  handleActionChooseLanguage(index) {
    switch (index) {
      case 0:
        this.updateLanguage(Constants.SettingScreen.VIETNAM_VALUE);
        break;
      case 1:
        this.updateLanguage(Constants.SettingScreen.ENGLISH_VALUE);
        break;
      case 2:
        break;
    }
  }

  updateLanguage(language) {
    if (language === this.state.language) {
      return;
    }
    I18n.locale = language;
    DataService.setLanguage(language);
    EventRegister.emit(Constants.RELOAD_LANGUAGE);
    this.setState({
      language
    });
  }

  componentWillMount(){
    this.realoadAdListener = EventRegister.addEventListener(Constants.STATUS_NETWORK, (data) => {
      this.setState({
        connected: data
      })
    })
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }
  componentWillUnmount(){
    EventRegister.removeEventListener(this.realoadAdListener);
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  onAndroidBackPress = () => {
    this.props.navigation.goBack();
    return true;
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#EEEEEE' }}>
        <Header style={Config.Styles.header}>
          <HeaderBase title={Localizations('settingScreen.setting')} navigation={this.props.navigation} />
        </Header>
        <Body>
          <Content>
            <View>
              <TouchableOpacity
                style={{
                  width: width - 20,
                  height: 40,
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 10,
                  borderWidth: 1,
                  borderColor: '#CACACA',
                  borderRadius: 5,
                  justifyContent: 'space-between'
                }}
                onPress={() => this.actionLanguage.show()}
              >
                <Text style={{ marginLeft: 10, fontSize: 16 }}>
                {Localizations('settingScreen.language')}
                </Text>
                <View
                  style={{
                    width: width / 2,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    paddingRight: 10
                  }}
                >
                  <Text style={{ marginLeft: 10, fontSize: 16 }}>
                    {this.state.language ===
                    Constants.SettingScreen.ENGLISH_VALUE
                      ? Constants.SettingScreen.ENGLISH_LABEL
                      : Constants.SettingScreen.VIETNAM_LABEL}
                  </Text>
                  <Image
                    style={{ width: 20, height: 20, marginLeft: 10 }}
                    source={Images.imageArrowDownBlack}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#CACACA',
                  width: width - 20,
                  marginHorizontal: 10,
                  marginTop: 10,
                  borderRadius: 5,
                  padding: 10
                }}
              >
                <Text style={{ fontSize: 16, marginTop: 3, color: '#00ADD8' }}>
                Copyright @ 1998-2019. 
                </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://esl-lab.com/randall.htm')}>
                  <Text style={{ fontSize: 16, marginTop: 3, color: '#FF0099' }}>
                  Randall Davis.
                  </Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, marginTop: 3, color: '#00ADD8' }}>
                All rights reserved.
                </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://esl-lab.com/copy.htm')}>
                  <Text style={{ fontSize: 16, marginTop: 3, color: '#FF0099' }}>
                  Read complete Terms of Use for more information.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Content>
        </Body>
        {
          this.state.connected && 
          <Footer style={{ backgroundColor: 'white'}}>
            <AdmobBanner/>
          </Footer>
        }
        <ActionSheet
          ref={o => (this.actionLanguage = o)}
          title={Localizations('settingScreen.change_language')}
          options={this.optionsLanguage}
          cancelButtonIndex={this.optionsLanguage.length - 1}
          destructiveButtonIndex={this.state.language === Constants.SettingScreen.ENGLISH_VALUE ? 1 : 0}
          onPress={index => this.handleActionChooseLanguage(index)}
        />
      </Container>
    );
  }
}

export default index;
