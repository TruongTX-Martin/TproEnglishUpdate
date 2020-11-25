import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  BackHandler
} from 'react-native';
import axios from 'axios';
import { Container, Body, Content, Header, Footer, Button } from 'native-base';
import Config from '../../Config';
import Localization from '../../Localization';
import { Localizations } from '../../i18n';
import HeaderBase from '../../Components/HeaderBase';
import Images from '../../Assets/Images';
import DataService from '../../Services/DataService';
import ActionSheet from 'react-native-actionsheet';
import I18n from 'react-native-i18n';
import RNExitApp from 'react-native-exit-app';
import { EventRegister } from 'react-native-event-listeners'
import Constants from '../../Config/Constant';
import AdmobBanner from '../../Components/AdmobBanner';
import Style from '../Detail/style';
import Loading from '../../Components/Loading';

var { height, width } = Dimensions.get('window');
const TAB = {
  CATEGORY: 0,
  MYWORD: 1,
  MYWRONGWORD: 2
};
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      listCategory: [],
      listMyWord: [],
      listMyWrongWord: [],
      tab: TAB.CATEGORY,
      connected: true
    };
    this.listOptionActionPratice = [
      'SlideShow',
      'FillWord',
      'Quizz Game',
      Localizations('detailScreen.cancel')
    ];
  }

  componentDidMount() {
    this.checkFirstTime();
    this.getLanguage();
  }

  getLanguage() {
    DataService.getLanguage().then(language => {
      if (language != null && language.trim().length > 0) {
        I18n.locale = language;
        this.setState({ language });
      } else {
        const locale = I18n.currentLocale();
        if (locale === 'vi-VN') {
          I18n.locale = Constants.SettingScreen.VIETNAM_VALUE;
          this.setState({
            ...this.state
          })
        }
      }
    }).catch(err => console.log('Error:', err));
  }

  async checkFirstTime() {
    this.getData();
  }

  gotoTutorial() {
    this.props.navigation.navigate('Tutorial', { onDone: () => this.getData() });
  }

  componentWillMount() {
    this.listenerReloadListword = EventRegister.addEventListener(Constants.RELOAD_LISTWORD, (data) => {
      this.getMyWords();
    });
    this.listenerReloadListwordWrong = EventRegister.addEventListener(Constants.RELOAD_LISTWRONGWORD, (data) => {
      this.getMyWrongsWord();
    });
    this.realoadAdListener = EventRegister.addEventListener(Constants.STATUS_NETWORK, (connected) => {
      this.setState({
        connected
      });
      this.checkReloadData(connected);
    });
    this.listenerReloadLanguage = EventRegister.addEventListener(Constants.RELOAD_LANGUAGE, (data) => {
      this.setState({
        ...this.state
      })
    })
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  async checkReloadData() {
    if (connected && this.state.listCategory.length === 0) {
      this.getData();
    }
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listenerReloadListword);
    EventRegister.removeEventListener(this.listenerReloadListwordWrong);
    EventRegister.removeEventListener(this.realoadAdListener);
    EventRegister.removeEventListener(this.listenerReloadLanguage);
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  onAndroidBackPress = () => {
    Alert.alert(
      '',
      'Bạn có muốn thoát ứng dụng không?',
      [
        {
          text: 'Không'
        },
        {
          text: 'Có',
          onPress: () => RNExitApp.exitApp()
        }
      ],
      {
        cancelable: false
      }
    );
    return true;
  }


  getData() {
    if (!this.state.connected && this.state.listCategory.length === 0) {
      Alert.alert('', Localizations('listLesson.netWorkError'));
      return;
    }
    this.getCategoryFromDB();
    this.getListWordInDB();
  }

  getListWordInDB() {
    this.getMyWords();
    this.getMyWrongsWord();
  }

  getCategoryFromDB() {
    const categorys = DataService.getData(Constants.CATEGORY);
    const childCategory = DataService.getData(Constants.CHILDCATEGORY);
    this.mergerListData(categorys, childCategory);
    if (categorys.length == 0 || childCategory.length == 0) {
      this.getCategory();
    }
  }

  getCategory = () => {
    this.setState({ loading: true });
    axios
      .get('/category.json')
      .then(res => {
        let arrayCategory = [];
        for (let key in res.data) {
          arrayCategory.push({
            id: key,
            ...res.data[key]
          });
        }
        DataService.saveArrayData(arrayCategory, Constants.CATEGORY);
        this.getChildCategory(arrayCategory);
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  };

  mergerListData(categorys, childCates) {
    let arrayData = [];
    for (let i = 0; i < categorys.length; i++) {
      arrayData.push({
        ...categorys[i],
        child: childCates.filter(e => e.categoryId === categorys[i].id),
        isExpand: false,
        title: categorys[i]?.title,
      });
    }
    arrayData = arrayData.sort((a, b) => a?.title.localeCompare(b?.title));
    this.setState({ listCategory: arrayData });
  }

  getChildCategory = categorys => {
    axios
      .get('/childCategory.json')
      .then(res => {
        let childCates = [];
        for (let key in res.data) {
          childCates.push({
            id: key,
            ...res.data[key]
          });
        }
        DataService.saveArrayData(childCates, Constants.CHILDCATEGORY);
        this.mergerListData(categorys, childCates);
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  };

  onPressCategory(item, index) {
    item.isExpand = !item.isExpand;
    const arr = this.state.listCategory;
    for (let i = 0; i < arr.length; i++) {
      if (i === index) {
        arr[i] = item;
      } else {
        arr[i].isExpand = false;
      }
    }
    this.setState({ listCategory: arr });
  }

  onPressChildCategory(item) {
    this.props.navigation.navigate('LessonList', { childCategory: item, connected: this.state.connected });
  }

  renderItem({ item, index }) {
    return (
      <View>
        <TouchableOpacity
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          onPress={() => this.onPressCategory(item, index)}
        >
          <View style={{ width: width - 40 }}>
            <Text
              style={{
                fontSize: 16,
                marginVertical: 10,
                marginHorizontal: 5,
                fontWeight: 'bold',
                color: item.isExpand ? 'red' : 'black'
              }}
            >
              {item.title}
            </Text>
          </View>
          <View
            style={{
              width: 40,
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            <Image
              style={{ width: 20, height: 20, marginLeft: 3 }}
              source={
                item.isExpand
                  ? Images.imageArrowDownBlack
                  : Images.imageArrowUpBlack
              }
            />
          </View>
        </TouchableOpacity>
        {item.isExpand &&
          item.child.length > 0 &&
          item.child.map(child => (
            <View key={child.id}>
              <View
                style={{
                  width: width - 10,
                  height: 1,
                  backgroundColor: '#CACACA',
                  marginHorizontal: 15
                }}
              />
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
                onPress={() => this.onPressChildCategory(child)}
              >
                <View style={{ width: width - 40 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      marginVertical: 10,
                      marginHorizontal: 5,
                      paddingLeft: 10
                    }}
                  >
                    {child.title}
                  </Text>
                </View>
                <View
                  style={{
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                  }}
                >
                  <Image
                    style={{ width: 20, height: 20, marginLeft: 3 }}
                    source={Images.imageArrowRightBlack}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ))}
        <View
          style={{
            width: width - 10,
            height: 1,
            backgroundColor: '#CACACA',
            marginHorizontal: 5
          }}
        />
      </View>
    );
  }

  openSetting() {
    this.props.navigation.navigate('Setting', { connected: this.state.connected });
  }

  getMyWords() {
    this.setState({
      listMyWord: DataService.getMyWords()
    });
  }

  getMyWrongsWord() {
    this.setState({
      listMyWrongWord: DataService.getMyWrongWords()
    });
  }

  gotoDetailNewword(item) {
    this.props.navigation.navigate('AddNewWord',
      {
        newWord: item,
        onBack: () => this.getListWordInDB(),
        connected: this.state.connected
      });
  }

  removeMyWordItem(item) {
    DataService.removeFromMyWord(item);
    const myWords = this.state.listMyWord.filter(e => this.state.listMyWord.indexOf(e) != this.state.listMyWord.indexOf(item))
    this.setState({
      listMyWord: myWords
    });
  }

  renderMyWordItem({ item, index }) {
    return (
      <View style={{}}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: width - 90, marginTop: 10, paddingLeft: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.title}</Text>
            <Text style={{ fontSize: 14, }}>{item.meaning}</Text>
            {
              item.note.trim().length > 0 && (
                <Text style={{ fontSize: 12, color: 'red', marginBottom: 3 }}>( {item.note} )</Text>
              )
            }
          </View>
          <View
            style={{
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
                Alert.alert(
                  '',
                  Localizations('detailScreen.messageDeleteWord'), [{
                    text: Localizations('detailScreen.no'),
                  }, {
                    text: Localizations('detailScreen.yes'),
                    onPress: () => this.removeMyWordItem(item)
                  },], {
                  cancelable: false
                }
                )
              }}
            >
              <Image
                style={{ width: 30, height: 30 }}
                source={Images.imageDelete}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 40, marginLeft: 10, height: 40, justifyContent: 'center' }}
              onPress={() => this.gotoDetailNewword(item)}
            >
              <Image
                style={{ width: 20, height: 20 }}
                source={Images.imageArrowRightBlack}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width, height: 1, backgroundColor: '#CACACA', marginBottom: 10 }} />
      </View>
    );
  }
  renderMyWrongWordItem({ item, index }) {
    return (
      <View style={{}}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: width - 90, marginTop: 10, paddingLeft: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.title}</Text>
            <Text style={{ fontSize: 14, }}>{item.meaning}</Text>
            {
              item.note.trim().length > 0 && (
                <Text style={{ fontSize: 12, color: 'red', marginBottom: 3 }}>( {item.note} )</Text>
              )
            }
          </View>
          <View
            style={{
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
              }}
            >
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 40, marginLeft: 10, height: 40, justifyContent: 'center' }}
              onPress={() => this.gotoDetailNewword(item)}
            >
              <Image
                style={{ width: 20, height: 20 }}
                source={Images.imageArrowRightBlack}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width, height: 1, backgroundColor: '#CACACA', marginBottom: 10 }} />
      </View>
    );
  }

  render() {
    let { listCategory, loading, listMyWrongWord, listMyWord, tab, connected } = this.state;
    return (
      <Container>
        <Header style={Config.Styles.header}>
          <HeaderBase
            title={Localization.homeScreen.titleHeader}
            showSetting
            openSetting={() => this.openSetting()}
          />
        </Header>
        <Body>
          <Content>
            {
              connected && <AdmobBanner />
            }
            <Loading visible={loading} color={'#00A8D9'} styles={{ marginTop: 50 }} />
            {
              !loading && listCategory.length == 0 && <TouchableOpacity
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width, marginTop: 20 }}
                onPress={() => this.getCategory()}
              >
                <Text style={{ textAlign: 'center' }}>Tải lại dữ liệu</Text>
                <Image style={{ width: 50, height: 50, marginTop: 20 }} source={Images.imageIcReload} />
              </TouchableOpacity>
            }
            {
              this.state.tab === TAB.CATEGORY && (
                <FlatList
                  extraData={listCategory}
                  data={listCategory}
                  keyExtractor={(item, index) => item?.id?.toString()}
                  renderItem={(item, index) => this.renderItem(item, index)}
                />
              )
            }
            {
              tab === TAB.MYWORD && (
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{ width: 30, height: 30, marginVertical: 5 }}
                    onPress={() => this.actionPractice.show()}
                  >
                    <Image style={{ width: 30, height: 30, marginVertical: 5 }} source={Images.imageAction} />
                  </TouchableOpacity>
                  <FlatList
                    extraData={listMyWord}
                    data={listMyWord}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(item, index) =>
                      this.renderMyWordItem(item, index)
                    }
                  />
                  {
                    listMyWord.length === 0 && <Text style={{ marginTop: 40 }}>{'Bạn chưa thêm từ mới nào'}</Text>
                  }
                </View>
              )
            }
            {
              tab == TAB.MYWRONGWORD && (
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{ width: 30, height: 30, marginVertical: 5 }}
                    onPress={() => this.actionPractice.show()}
                  >
                    <Image style={{ width: 30, height: 30, marginVertical: 5 }} source={Images.imageAction} />
                  </TouchableOpacity>
                  <FlatList
                    extraData={listMyWrongWord}
                    data={listMyWrongWord}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(item, index) =>
                      this.renderMyWrongWordItem(item, index)
                    }
                  />
                  {
                    listMyWrongWord.length === 0 && <Text style={{ marginTop: 40 }}>{Localizations('detailScreen.listEmpty')}</Text>
                  }
                </View>
              )
            }

          </Content>
        </Body>
        <ActionSheet
          ref={o => (this.actionPractice = o)}
          title={Localizations('detailScreen.practice')}
          options={this.listOptionActionPratice}
          cancelButtonIndex={this.listOptionActionPratice.length - 1}
          onPress={index => this.handlePressActionPractice(index)}
        />
        <Footer style={{ backgroundColor: '#00ADD8' }}>
          <View style={Style.viewTab}>
            <TouchableOpacity
              style={Style.tab}
              onPress={() => this.setState({ tab: TAB.CATEGORY })}
            >
              <View
                style={
                  this.state.tab === TAB.CATEGORY
                    ? Style.tabLineBottomSelected
                    : Style.tabLineBottom
                }
              />
              <View style={Style.viewText}>
                <Text
                  style={
                    this.state.tab === TAB.CATEGORY
                      ? Style.textTabSelected
                      : Style.textTab
                  }
                >
                  {Localizations('detailScreen.category')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={Style.tab}
              onPress={() => this.setState({ tab: TAB.MYWORD })}
            >
              <View
                style={
                  this.state.tab === TAB.MYWORD
                    ? Style.tabLineBottomSelected
                    : Style.tabLineBottom
                }
              />
              <View style={Style.viewText}>
                <Text
                  style={
                    this.state.tab === TAB.MYWORD
                      ? Style.textTabSelected
                      : Style.textTab
                  }
                >
                  {Localizations('detailScreen.myWord')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={Style.tab}
              onPress={() => {
                this.setState({ tab: TAB.MYWRONGWORD })
              }}
            >
              <View
                style={
                  this.state.tab === TAB.MYWRONGWORD
                    ? Style.tabLineBottomSelected
                    : Style.tabLineBottom
                }
              />
              <View style={Style.viewText}>
                <Text
                  style={
                    this.state.tab === TAB.MYWRONGWORD
                      ? Style.textTabSelected
                      : Style.textTab
                  }
                >
                  {Localizations('detailScreen.myWrongWord')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Footer>
      </Container>
    );
  }

  handlePressActionPractice(index) {
    const listWord = this.state.tab === TAB.MYWORD ? this.state.listMyWord : this.state.listMyWrongWord
    if (listWord.length < 1 && index === 3) {
      return;
    }
    if (listWord.length < 1) {
      Alert.alert('', Localizations('detailScreen.cannotPraticeWithEmpty'));
      return;
    }
    switch (index) {
      case 0:
        this.props.navigation.navigate('SlideShow', { newWords: listWord });
        break;
      case 1:
        this.props.navigation.navigate('FillWord', { newWords: listWord });
        break;
      case 2:
        if (listWord.length < 4) {
          Alert.alert('', Localizations('detailScreen.atleast4Word'));
          return;
        } else {
          this.props.navigation.navigate('Quizz', { newWords: listWord });
        }
        break;
    }
  }
}

export default index;
