import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
  NativeModules,
  BackHandler
} from 'react-native';
import { Container, Body, Content, Header, Button, Item, Footer } from 'native-base';
import HeaderBase from '../../Components/HeaderBase';
import Config from '../../Config';
import Style from './style';
import Images from '../../Assets/Images';
import DataService from '../../Services/DataService';
import ActionSheet from 'react-native-actionsheet';
import Slider from "react-native-slider";
import Constants from '../../Config/Constant';
import RNFetchBlob from 'rn-fetch-blob';
import Loading from '../../Components/Loading';
import AdmobBanner from '../../Components/AdmobBanner';
import { getTopAndBottomHeight } from '../../Helper/StatusBar';
import { EventRegister } from 'react-native-event-listeners';
import { showInterstitialAd } from '../../utils';
const Sound = require('react-native-sound');
Sound.setCategory('Playback');
import { Localizations } from '../../i18n';
const { width, height } = Dimensions.get('window');
const PermissionSetting = NativeModules.PermissionSetting;

const TAB = {
  QUESTION: 0,
  NEWWORD: 1,
  TRANSCRIPT: 2
};

const HEIGHT_TAB = 50;
const HEIGHT_TOP = 50;
const HEIGHT_BOTTOM = 20;
const HEIGHT_ADMOB = 52;
const PATH_DOWNLOAD = RNFetchBlob.fs.dirs.DocumentDir + '/martin/';
const PATH_DOWNLOAD_ANDROID = RNFetchBlob.fs.dirs.DCIMDir + '/martin/';
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lesson: null,
      tab: TAB.QUESTION,
      isPlaying: false,
      hasStart: false,
      showMessageAnswerQuesiton: false,
      isSubmit: false,
      total: 0,
      score: 0,
      newWords: [],
      itemDelete: null,
      loading: false,
      totalTime: 0,
      minTime: '0.00',
      maxTime: '0.00',
      currentTime: 0,
      isDownloaded: false,
      downloading: false,
      connected: props.navigation.state.params.connected
    };
    this.listOptionActionPratice = [
      'SlideShow',
      'FillWord',
      'Quizz Game',
      Localizations('detailScreen.cancel')
    ];
    this.listOptionActionNewWord = [
      Localizations('detailScreen.addToMyWord'),
      Localizations('detailScreen.removeFromMyWord'),
      Localizations('detailScreen.delete'),
      Localizations('detailScreen.cancel')
    ];
    this.whoosh = null;
  }

  componentWillMount() {
    this.realoadAdListener = EventRegister.addEventListener(Constants.STATUS_NETWORK, (connected) => {
      this.setState({
        connected
      })
      if (connected) {
        this.checkFileDownloaded();
      }
    });
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }
  componentWillUnmount() {
    EventRegister.removeEventListener(this.realoadAdListener);
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    this.whoosh.release();
  }

  onAndroidBackPress = () => {
    const onBack = this.props.navigation.state.params.onBack;
    if (onBack) {
      onBack();
    }
    this.props.navigation.goBack();
    return true;
  }

  componentDidMount() {
    const lessonParam = this.props.navigation.state.params.lesson;
    let lesson = JSON.parse(JSON.stringify(lessonParam));
    let newArrQuesiton = [];
    const questions = lesson.questions;
    for (let i in questions) {
      let questionItem = questions[i];
      let arrAnswers = [];
      for (let j in questionItem.answers) {
        arrAnswers.push({
          ...questionItem.answers[j],
          isSelected: false
        });
      }
      questionItem.answers = arrAnswers;
      newArrQuesiton.push(questionItem);
    }
    lesson.questions = newArrQuesiton;
    this.setState({
      lesson
    });
    this.getNewWordsDB();
    this.checkFileDownloaded();
    if (!DataService.getShowAdDetail()) {
      showInterstitialAd();
      DataService.setShowAdDetail(true);
    }
  }

  checkFileDownloaded() {
    const url = this.props.navigation.state.params.lesson.url;
    const pathDownload = Platform.OS === 'ios' ? PATH_DOWNLOAD : PATH_DOWNLOAD_ANDROID;
    const file = pathDownload + this.getNameFromUrl(url);
    RNFetchBlob.fs.exists(file)
      .then((exist) => {
        this.setState({ isDownloaded: exist })
        if (exist) {
          this.loadSoundOnline(file);
        } else {
          if (this.state.connected) {
            this.loadSoundOnline(url);
          } else {
            Alert.alert('', Localizations('listLesson.netWorkError'));
          }
        }
      })
      .catch(err => {
        console.log('Error:', err);
      })
  }

  getNameFromUrl(url) {
    try {
      return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('?'));
    } catch (error) {
    }
    return '';
  }

  loadSoundOnline(url) {
    this.setState({ loading: true });
    this.whoosh = new Sound(url, '', (error) => {
      if (error) {
        this.setState({
          loading: false
        })
        return;
      } else {
        // loaded successfully
        const duration = Math.floor(this.whoosh._duration);
        this.setState({
          loading: false,
          totalTime: duration,
          maxTime: this.getStringMinute(duration)
        })
      }

    });
  }

  getStringMinute(time) {
    if (Math.floor((time - Math.floor(time / 60) * 60)) < 10) {
      return Math.floor(time / 60) + ":0" + Math.floor((time - Math.floor(time / 60) * 60));
    } else {
      return Math.floor(time / 60) + ":" + Math.floor((time - Math.floor(time / 60) * 60));
    }
  }

  getNewWordsDB() {
    const newWords = DataService.getNewWordByLesson(this.props.navigation.state.params.lesson);
    this.setState({ newWords: newWords });
  }

  componentWillUnmount() {
    if (this.whoosh) {
      this.whoosh.release();
    }
  }

  chooseAnswer(index, indexAnswer, itemAnswer) {
    let lesson = this.state.lesson;
    let questions = lesson.questions;
    let questionItem = questions[index];
    let newArrAnswers = [];
    let answers = questionItem.answers;
    for (let i = 0; i < answers.length; i++) {
      const item = answers[i];
      if (itemAnswer.isSelected === false) {
        if (i === indexAnswer) {
          item.isSelected = !itemAnswer.isSelected;
        } else {
          item.isSelected = false;
        }
      } else {
        item.isSelected = false;
      }
      newArrAnswers.push(item);
    }
    questionItem.answers = newArrAnswers;
    questions[index] = questionItem;
    lesson.questions = questions;
    this.setState({ lesson });
  }

  renderQuestionItem({ item, index }) {
    return (
      <View key={index} style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
          {index + 1}. {item.question}
        </Text>
        {item.answers.map((itemAnswer, indexAnswer) => (
          <TouchableOpacity
            key={itemAnswer.key}
            style={{ flexDirection: 'row', marginTop: 5 }}
            onPress={() => this.chooseAnswer(index, indexAnswer, itemAnswer)}
          >
            <View
              style={{ width: 25, justifyContent: 'center' }}
              disabled={this.state.isSubmit}
            >
              <Image
                style={{ width: 15, height: 15 }}
                source={
                  itemAnswer.isSelected
                    ? Images.imageRadioSelected
                    : Images.imageRadio
                }
              />
            </View>
            <View style={{ paddingRight: 5, width: width - 50 }}>
              <Text style={{
                marginRight: 5,
                textDecorationLine: this.state.isSubmit && itemAnswer.checked ? 'underline' : 'none',
                fontWeight: this.state.isSubmit && itemAnswer.checked ? 'bold' : 'normal',
                color: this.state.isSubmit && itemAnswer.isSelected && !itemAnswer.checked ? 'red' : 'black'
              }}>
                {itemAnswer.key}: {itemAnswer.value}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  renderTranscriptItem({ item, index }) {
    return (
      <View
        key={index}
        style={{ paddingTop: 10 }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}:</Text>
        <Text style={{ fontSize: 15, marginLeft: 0 }}>{item.content}</Text>
        <View style={{ width, height: 1, backgroundColor: 'gray', marginTop: 10 }} />
      </View>
    );
  }

  handlePlayFile() {
    if (this.state.maxTime == '0.00') {
      Alert.alert('', 'Không có kết nối mạng');
      return;
    }
    if (this.state.loading || !this.whoosh) return;
    if (!this.state.hasStart) {
      this.playAudio();
      this.setState({
        isPlaying: true,
        hasStart: true
      })
      this.getCurrentTime();
    } else if (this.state.isPlaying) {
      this.setState({ isPlaying: false });
      this.whoosh.pause();
    } else {
      this.whoosh.play();
      this.setState({ isPlaying: true }, () => this.getCurrentTime());
    }
  }

  playAudio() {
    this.whoosh.play((success) => {
      if (success) {
        this.setState({ isPlaying: false, minTime: '0.00' })
        this.handlePlayFile();
      } else {
      }
    });
  }

  getCurrentTime() {
    setTimeout(() => {
      this.whoosh.getCurrentTime((seconds) => {
        this.setState({
          currentTime: Math.floor(seconds),
          minTime: this.getStringMinute(seconds)
        })
        if (this.state.isPlaying) {
          this.getCurrentTime();
        }
      })
    }, 1000);
  }

  isAnswersQuestion(answers) {
    for (let i = 0; i < answers.length; i++) {
      if (answers[i].isSelected) {
        return true;
      }
    }
    return false;
  }

  submitAnswers() {
    if (this.state.isSubmit) {
      return;
    }
    const questions = this.state.lesson.questions;
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!this.isAnswersQuestion(question.answers)) {
        this.setState({ showMessageAnswerQuesiton: true })
        return;
      }
    }
    let total = 0;
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      const answers = questions[i].answers;
      total += 1;
      for (let j = 0; j < answers.length; j++) {
        if (answers[j].checked === true && answers[j].isSelected === true) {
          score += 1;
        }
      }
    }
    const lessonParam = this.props.navigation.state.params.lesson;
    DataService.updateLesson(lessonParam, total, score);
    this.setState({
      showMessageAnswerQuesiton: false,
      isSubmit: true,
      total: total,
      score: score
    });
  }

  caculateResult() {
    return (this.state.score / this.state.total) * 100;
  }

  getTranscript() {
    let arr = [];
    const lesson = this.state.lesson;
    if (lesson != null) {
      const transcripts = lesson.transcripts;
      for (let key in transcripts) {
        arr.push(transcripts[key]);
      }
    }
    return arr;
  }

  addNewWord() {
    this.props.navigation.navigate('AddNewWord', {
      lessonId: this.state.lesson.id,
      childCategoryId: this.props.navigation.state.params.childCategoryId,
      onBack: () => this.getNewWordsDB(),
      connected: this.state.connected
    });
  }

  onDeleteNewWordItem() {
    if (this.state.itemDelete != null) {
      DataService.deleteNewWord(this.state.itemDelete);
      this.setState({ ...this.state, itemDelete: null })
      this.getNewWordsDB();
    }
  }

  gotoDetailNewword(item) {
    this.props.navigation.navigate('AddNewWord', { newWord: item, onBack: () => this.getNewWordsDB() });
  }

  renderNewwordItem({ item, index }) {
    return (
      <View style={{}}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: width - 90, marginTop: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: item.isMyWord ? '#00B2D7' : '#000000' }}>{item.title}</Text>
            <Text style={{ fontSize: 14, }}>{item.meaning}</Text>
            {
              item?.note?.trim().length > 0 && (
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
                this.setState({
                  itemDelete: item,
                }, () => {
                  this.actionNewWord.show();
                })
              }}
            >
              <Image
                style={{ width: 30, height: 30 }}
                source={Images.imageMore}
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
        <View style={{ width: width - 20, height: 1, backgroundColor: '#CACACA', marginBottom: 10 }} />
      </View>
    );
  }

  changeValueSlider(value) {
    if (value === this.state.totalTime) {
      this.setState({
        isPlaying: false,
      })
      this.whoosh.setCurrentTime(0);
      return;
    }
    this.setState({
      minTime: this.getStringMinute(value)
    })
    this.whoosh.setCurrentTime(value);
  }

  async handleDowloadFile() {
    if (this.state.isDownloaded || this.state.downloading) return;
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.startDownload();
        } else {
          Alert.alert(
            '',
            'Open permission in storge', [{
              text: 'Cancel',
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
      this.startDownload();
    }

  }

  startDownload() {
    const url = this.state.lesson.url;
    const fileName = this.getNameFromUrl(url);
    const pathDownload = Platform.OS === 'android' ? PATH_DOWNLOAD_ANDROID : PATH_DOWNLOAD;
    const pathSave = pathDownload + fileName;
    this.setState({ downloading: true })
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
        this.checkFileDownloaded();
        this.setState({ downloading: false })
      }).catch(error => {
        this.setState({ downloading: false })
      })
  }

  canculateHeight() {
    if (this.state.connected) {
      return getTopAndBottomHeight() + HEIGHT_TOP + HEIGHT_TAB + HEIGHT_BOTTOM + HEIGHT_ADMOB;
    }
    return getTopAndBottomHeight() + HEIGHT_TOP + HEIGHT_TAB + HEIGHT_BOTTOM;
  }

  render() {
    const onBack = this.props.navigation.state.params.onBack;
    const { newWords, tab } = this.state;
    console.log('newWords;', newWords);
    return (
      <Container style={{ backgroundColor: '#EEEEEE' }}>
        <Header style={Config.Styles.header}>
          <HeaderBase
            title={
              this.state.lesson && this.state.lesson.title
                ? this.state.lesson.title
                : ''
            }
            navigation={this.props.navigation}
            goBack={() => onBack ? onBack() : null}
          />
        </Header>
        <Body>
          <View style={{ backgroundColor: '#EEEEEE' }}>
            {
              this.state.connected &&
              <View style={{ width, height: HEIGHT_ADMOB, borderBottomWidth: 2, alignItems: 'center' }}>
                <AdmobBanner />
              </View>
            }
            <View
              style={{
                borderRadius: 5,
                width: width - 10,
                height: 50,
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 5,
                flexDirection: 'row',
              }}
            >

              {/* <TouchableOpacity style={{ width: 35 }} onPress={() => this.handleDowloadFile()}>
                {
                  this.state.downloading &&
                  <View style={{ width: 35, height: 35, justifyContent: 'center' }}>
                    <Loading visible={this.state.downloading} color='#00ADD8' size='small' />
                  </View>
                }
                {
                  !this.state.downloading &&
                  <Image
                    style={{ width: 25, height: 25 }}
                    source={this.state.isDownloaded ? Images.imageDownloaded : Images.imageNotDownload}
                  />
                }

              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => this.handlePlayFile()}>
                {
                  this.state.loading && (
                    <View style={{ width: 35, height: 35, justifyContent: 'center' }}>
                      <Loading visible={this.state.loading} color='#00ADD8' size='small' />
                    </View>
                  )
                }
                {
                  !this.state.loading && <Image
                    style={{ width: 35, height: 35, marginHorizontal: 5 }}
                    source={
                      this.state.isPlaying
                        ? Images.imagePauseBlack
                        : Images.imagePlayBlack
                    }
                  />
                }

              </TouchableOpacity>

              <View style={{ width: width - 70, marginRight: 10 }}>
                <Slider
                  animateTransitions={true}
                  value={this.state.currentTime}
                  minimumValue={0}
                  maximumValue={this.state.totalTime}
                  style={{ width: width - 70, height: 25, marginTop: 15 }}
                  minimumTrackTintColor='#00ADD8'
                  maximumTrackTintColor='#B3B3B3'
                  thumbStyle={Style.thumb}
                  trackStyle={Style.track}
                  onValueChange={(value) => this.changeValueSlider(value)}
                />
                <View style={{ width: width - 90, marginBottom: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text>{this.state.minTime}</Text>
                  <Text>{this.state.maxTime}</Text>
                </View>
              </View>
            </View>
            <View style={Style.viewTab}>
              <TouchableOpacity
                style={Style.tab}
                onPress={() => this.setState({ tab: TAB.QUESTION })}
              >
                <View style={Style.viewText}>
                  <Text
                    style={
                      this.state.tab === TAB.QUESTION
                        ? Style.textTabSelected
                        : Style.textTab
                    }
                  >
                    {Localizations('detailScreen.question')}
                  </Text>
                </View>
                <View
                  style={
                    this.state.tab === TAB.QUESTION
                      ? Style.tabLineBottomSelected
                      : Style.tabLineBottom
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={Style.tab}
                onPress={() => this.setState({ tab: TAB.NEWWORD })}
              >
                <View style={Style.viewText}>
                  <Text
                    style={
                      this.state.tab === TAB.NEWWORD
                        ? Style.textTabSelected
                        : Style.textTab
                    }
                  >
                    {Localizations('detailScreen.newWord')}
                  </Text>
                </View>
                <View
                  style={
                    this.state.tab === TAB.NEWWORD
                      ? Style.tabLineBottomSelected
                      : Style.tabLineBottom
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={Style.tab}
                onPress={() => {
                  this.setState({ tab: TAB.TRANSCRIPT })
                }}
              >
                <View style={Style.viewText}>
                  <Text
                    style={
                      this.state.tab === TAB.TRANSCRIPT
                        ? Style.textTabSelected
                        : Style.textTab
                    }
                  >
                    {Localizations('detailScreen.transcript')}
                  </Text>
                </View>
                <View
                  style={
                    this.state.tab === TAB.TRANSCRIPT
                      ? Style.tabLineBottomSelected
                      : Style.tabLineBottom
                  }
                />
              </TouchableOpacity>
            </View>
            <View >
              {this.state.tab === TAB.QUESTION && this.state.lesson != null && (
                <View style={{ justifyContent: 'space-between' }}>
                  {
                    this.state.showMessageAnswerQuesiton &&
                    <Text style={{ color: 'red', alignSelf: 'center', fontSize: 13 }}>{Localizations('detailScreen.youNotAnswerAllQuestion')}</Text>
                  }
                  {
                    this.state.isSubmit &&
                    <Text style={{ color: this.caculateResult() >= 90 ? '#00ADD8' : 'red', alignSelf: 'center', fontWeight: 'bold', fontSize: 13 }}>Result: {this.state.score}/{this.state.total}</Text>
                  }
                  <FlatList
                    style={{ marginHorizontal: 10, marginBottom: 10, height: height - this.canculateHeight() }}
                    extraData={this.state.lesson.questions}
                    showsVerticalScrollIndicator={false}
                    data={this.state.lesson.questions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(item, index) =>
                      this.renderQuestionItem(item, index)
                    }
                  />
                </View>
              )}

              {
                this.state.tab === TAB.NEWWORD && newWords.length > 0 && (
                  <View style={{ justifyContent: 'space-between' }}>
                    <FlatList
                      style={{ marginHorizontal: 10, marginBottom: 10, height: height - this.canculateHeight() }}
                      extraData={newWords}
                      data={newWords}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={(item, index) =>
                        this.renderNewwordItem(item, index)
                      }
                    />
                  </View>
                )
              }
              {
                tab == TAB.NEWWORD && newWords.length == 0 && <View>
                  <Text style={{ textAlign: 'center', fontSize: 20, marginHorizontal: 15, marginTop: 30 }}>Lưu lại những từ mới của bài học và chọn Thực hành ở dưới để học dễ dàng hơn</Text>
                </View>
              }

              {this.state.tab === TAB.TRANSCRIPT && this.state.lesson != null && (
                <View style={{ justifyContent: 'space-between' }}>
                  <FlatList
                    style={{ marginHorizontal: 10, marginBottom: 10, height: height - this.canculateHeight() + 55 }}
                    extraData={this.state.lesson}
                    data={this.getTranscript()}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(item, index) =>
                      this.renderTranscriptItem(item, index)
                    }
                  />
                </View>
              )}
            </View>
          </View>
        </Body>
        { this.state.tab === TAB.QUESTION && (
          <Footer style={{ backgroundColor: 'white' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                style={{ width: width - 20, height: 40, borderRadius: 5, backgroundColor: '#00ADD8', justifyContent: 'center' }}
                onPress={() => this.submitAnswers()}
              >
                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}> {Localizations('detailScreen.submit')}</Text>
              </TouchableOpacity>
            </View>
          </Footer>
        )}

        {this.state.tab === TAB.NEWWORD && (
          <Footer style={{ backgroundColor: 'white' }}>
            <View style={{ width: width - 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                style={{ flex: 1, height: 40, backgroundColor: '#00ADD8', justifyContent: 'center', borderRadius: 5 }}
                onPress={() => this.addNewWord()}
              >
                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', alignSelf: 'center', }}>{Localizations('detailScreen.addNew')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, height: 40, marginLeft: 5, backgroundColor: '#00ADD8', justifyContent: 'center', borderRadius: 5 }}
                onPress={() => this.actionPractice.show()}
              >
                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', alignSelf: 'center', }}>{Localizations('detailScreen.practice')}</Text>
              </TouchableOpacity>
            </View>
          </Footer>
        )
        }
        <ActionSheet
          ref={o => (this.actionPractice = o)}
          title={Localizations('detailScreen.practiceNewWord')}
          options={this.listOptionActionPratice}
          cancelButtonIndex={this.listOptionActionPratice.length - 1}
          onPress={index => this.handlePressActionPractice(index)}
        />
        <ActionSheet
          ref={o => (this.actionNewWord = o)}
          title={Localizations('detailScreen.option')}
          options={this.listOptionActionNewWord}
          cancelButtonIndex={this.listOptionActionNewWord.length - 1}
          onPress={index => this.handlePressActionNewWord(index)}
        />
      </Container>
    );
  }

  handlePressActionNewWord(index) {
    switch (index) {
      case 0:
        if (this.state.itemDelete.isMyWord) {
          Alert.alert('', Localizations('detailScreen.wordExits'));
        } else {
          DataService.addToMyWord(this.state.itemDelete);
          this.getNewWordsDB();
          Alert.alert('', Localizations('detailScreen.addWordSuccess'));
        }
        this.setState({ itemDelete: null });
        break;
      case 1:
        if (!this.state.itemDelete.isMyWord) {
          Alert.alert('', Localizations('detailScreen.wordNotExits'));
        } else {
          DataService.removeFromMyWord(this.state.itemDelete);
          this.getNewWordsDB();
          Alert.alert('', Localizations('detailScreen.removeWordSuccess'));
        }
        this.setState({ itemDelete: null });
        break;
      case 2:
        Alert.alert(
          '',
          Localizations('detailScreen.messageDeleteWord'), [{
            text: Localizations('detailScreen.no'),
            onPress: () => this.setState({ itemDelete: null })
          }, {
            text: Localizations('detailScreen.yes'),
            onPress: () => this.onDeleteNewWordItem()
          },], {
          cancelable: false
        }
        )
        break;
    }
  }

  handlePressActionPractice(index) {
    if (this.state.newWords.length < 1 && index === 3) {
      return;
    }
    if (this.state.newWords.length < 1) {
      Alert.alert('', Localizations('detailScreen.cannotPraticeWithEmpty'));
      return;
    }
    switch (index) {
      case 0:
        this.props.navigation.navigate('SlideShow', { newWords: this.state.newWords, connected: this.state.connected });
        break;
      case 1:
        this.props.navigation.navigate('FillWord', { newWords: this.state.newWords, connected: this.state.connected });
        break;
      case 2:
        if (this.state.newWords.length < 4) {
          Alert.alert('', Localizations('detailScreen.atleast4Word'));
          return;
        } else {
          this.props.navigation.navigate('Quizz', { newWords: this.state.newWords, connected: this.state.connected });
        }
        break;
    }
  }
}


export default index;
