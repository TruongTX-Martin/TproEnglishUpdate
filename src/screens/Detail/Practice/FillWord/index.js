import React, { Component } from 'react';
import { Dimensions, View, Text, Image, TouchableOpacity,Alert,BackHandler } from 'react-native';
import { Container, Body, Content, Header, Footer } from 'native-base';
import Config from '../../../../Config';
import HeaderBase from '../../../../Components/HeaderBase';
import DataService from '../../../../Services/DataService';
import { EventRegister } from 'react-native-event-listeners'
import Constants from '../../../../Config/Constant';
import Images from '../../../../Assets/Images';
import { Localizations } from '../../../../i18n';
// import Popover from 'react-native-popover';
import AdmobBanner from '../../../../Components/AdmobBanner';
var { height, width } = Dimensions.get('window');
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      newWords: [],
      index: 0,
      currentWord: null,
      listAnswers: [],
      listSelect: [],
      listIndex: [],
      answer: null,
      isVisiblePopover: false,
      buttonPopover: {},
      numberWrong: 0,
      connected: props.navigation.state.params.connected
    };
  }

  componentDidMount() {
    this.getNewWordsDB();
  }


  onAndroidBackPress = () => {
    this.props.navigation.goBack();
    return true;
  }
  getNewWordsDB() {
    const newWords = this.props.navigation.state.params.newWords
    const currentWord = newWords[0];
    this.renderContent(currentWord,newWords);
  }

  renderContent(currentWord,newWords){
    let arrAnswers = [];
    let arrSelect = [];
    let title = currentWord.title.toLowerCase();
    title = title.replace(/\s/g, '');
    currentWord.title = title;
    for (let i = 0; i < currentWord.title.length; i++) {
        arrAnswers.push({
          key: i,
          value: ''
        });
    }
    for (let i = 0; i < currentWord.title.length; i++) {
        arrSelect.push({
          key: i,
          value: currentWord.title.charAt(i),
          select: false
        });
    }
    arrSelect = this.shuffleArray(arrSelect);
    this.setState({
      newWords: newWords,
      currentWord,
      listAnswers: arrAnswers,
      listSelect: arrSelect
    });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  onWordBack() {
    let currentIndex = this.state.index;
    currentIndex -= 1;
    const currentWord = this.state.newWords[currentIndex];
    this.setState({
      index: currentIndex,
      currentWord
    });
  }

  onWordNext() {
    let currentIndex = this.state.index;
    currentIndex += 1;
    const currentWord = this.state.newWords[currentIndex];
    this.setState({
      index: currentIndex,
      currentWord,
      answer: null
    });
    this.renderContent(currentWord, this.state.newWords);
  }

  handleUnSelected(index) {
    let listAnswers = this.state.listAnswers;
    let currentSelected = listAnswers[index];
    if (currentSelected.value === '') return;
    if(index < this.findLastAnswersIndex(listAnswers)) return;
    if(this.state.answer != null) return;
    currentSelected.value = '';
    listAnswers[index] = currentSelected;

    const listIndex = this.state.listIndex;
    const lastPosition = listIndex[listIndex.length -1];
    listIndex.pop();
    let listSelect = this.state.listSelect;
    listSelect[lastPosition].select = false;
    this.setState({ 
      listAnswers: listAnswers,
      listSelect,
      listIndex,
      answer:null
    });
  }

  findLastAnswersIndex(listAnswers) {
    for (let i=0; i< listAnswers.length; i++){
      if(listAnswers[i].value === '') {
        return i - 1;
      }
    }
    return -1;
  }


  showViewAnswers() {
    const arr = this.state.listAnswers;
    const viewArr =
      arr.length > 0 &&
      arr.map((e, index) => (
        <TouchableOpacity
          key={index}
          style={{
            width: 30,
            height: 35,
            marginHorizontal: 4,
            borderWidth: 1,
            borderColor: '#CACACA',
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 3
          }}
          onPress={() => this.handleUnSelected(index)}
        >
          <Text style={{ fontWeight: 'bold' }}>{e.value}</Text>
        </TouchableOpacity>
      ));
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
        {viewArr}
      </View>
      {
        this.state.answer != null && (
          <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
            <Image style={{ width: 30, height: 30 }} 
            source={this.state.answer ? Images.imageRightAnswer : Images.imageWrongAnswer }/>
            <Text style={{ color: this.state.answer ? '#00ADD8' : 'red'}}>{this.state.answer ? 'Đúng' :'Sai'}</Text>
          </View>
        )
      }
      </View>
    );
  }

  handleSelect(index) {
    const arrSelect = this.state.listSelect;
    let itemSelected = arrSelect[index];
    if(itemSelected.select === true) return;
    itemSelected.select = true;
    arrSelect[index] = itemSelected;

    let arrAnswers = this.state.listAnswers;
    for (let i=0; i< arrAnswers.length; i++) {
      if(arrAnswers[i].value === ''){
        arrAnswers[i].value = itemSelected.value;
        break;
      }
    }
    let arrIndex = this.state.listIndex;
    arrIndex.push(index);
    this.setState({ 
      listSelect: arrSelect,
      listIndex: arrIndex,
      listAnswers: arrAnswers
    },() => {
      const select = this.state.listSelect.find(e => e.select === false);
      if(select === undefined) {
        this.checkResult();
      }
    });
  }

  checkResult() {
    const listAnswers = this.state.listAnswers;
    const result = listAnswers.map(e => e.value).join('').trim();
    if(result === this.state.currentWord.title) {
      DataService.addToMyWordWrong(this.state.currentWord, false);
      this.setState({ answer: true });
      this.showMessageDone()
    }else{
      DataService.addToMyWordWrong(this.state.currentWord, true);
      this.setState({ answer: false, numberWrong: this.state.numberWrong + 1 },() => {
        this.showMessageDone();
      });
    }
  }

  showMessageDone(){
    if(this.state.index === this.state.newWords.length - 1){
      Alert.alert(
        '',
        Localizations('detailScreen.answerWrong') + this.state.numberWrong + Localizations('detailScreen.reviewWordAtHome'),
        [
          {text: 'OK', onPress: () => {
            EventRegister.emit(Constants.RELOAD_LISTWRONGWORD);
            this.props.navigation.goBack();
          }},
        ],
        {cancelable: false},
        );
    }
  }


  showUserSelect() {
    const arr = this.state.listSelect;
    const viewArr =
      arr.length > 0 &&
      arr.map((e, index) => (
        <TouchableOpacity
          key={index}
          style={{
            width: 30,
            height: 35,
            marginHorizontal: 4,
            borderWidth: 1,
            borderColor: '#CACACA',
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 3
          }}
          onPress={() => this.handleSelect(index)}
        >
          <Text style={{ fontWeight: 'bold' }}>{!e.select ? e.value: ''}</Text>
        </TouchableOpacity>
      ));
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
        {viewArr}
      </View>
    );
  }

  componentWillMount(){
    this.realoadAdListener = EventRegister.addEventListener(Constants.STATUS_NETWORK, (data) => {
      this.setState({
        connected: data
      })
    });
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }
  componentWillUnmount(){
    EventRegister.removeEventListener(this.realoadAdListener);
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  render() {
    const currentWord = this.state.currentWord;
    return (
      <Container style={{ backgroundColor: '#EEEEEE' }}>
        <Header style={Config.Styles.header}>
          <HeaderBase title={'Fill word'} navigation={this.props.navigation} />
        </Header>
        <Body>
          <Content>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ height, width: 50, marginTop: height / 3 + 20 }}>
              </View>
              <View style={{ width: width - 100, height }}>
                <View>
                  <View style={{  marginTop: height / 6, marginBottom: 5}}>
                    <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>{this.state.index + 1} / {this.state.newWords.length}</Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 5,
                      paddingBottom:10
                    }}
                  >
                  <View style={{alignItems: 'flex-end'}}>
                    <TouchableOpacity ref='buttonPopover' onPress={() => this.showPopover()}>
                      <Image style={{ width: 25, height: 25, marginRight: 5}} source={Images.imageInfor}/>
                    </TouchableOpacity>
                  </View>
                    <Text style={{ fontSize: 16, marginLeft: 20, fontWeight: 'bold' }}>
                      {currentWord != null ? currentWord.meaning : ''}
                    </Text>
                    {
                      currentWord != null && currentWord.note.length > 0 && 
                      <Text style={{ fontSize: 14, marginLeft: 20, color: '#0095C1'}}>
                      {currentWord != null ? '(' + currentWord.note + ')': ''}
                      </Text>
                    }
                  </View>
                  <View style={{ marginTop: 30 }}>
                    {this.showViewAnswers()}
                  </View>
                  <View style={{ marginTop: 100 }}>
                    {this.showUserSelect()}
                  </View>
                </View>
              </View>
              <View style={{ height, width: 50, marginTop: height / 3 + 20 }}>
                {this.state.index < this.state.newWords.length - 1 && this.state.answer != null && (
                  <TouchableOpacity onPress={() => this.onWordNext()}>
                        <Image
                          style={{ width: 40, height: 50 }}
                          source={Images.imageArrowRightBlack}
                        />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Content>
        </Body>
        {/* <Popover
          isVisible={this.state.isVisiblePopover}
          fromRect={this.state.buttonPopover}
          onClose={this.closePopover}>
          <Text>I'm the content of this popover!</Text>
        </Popover> */}
        {
          this.state.connected && 
          <Footer>
            <AdmobBanner/>
          </Footer>
        }
      </Container>
    );
  }
  showPopover() {
    this.refs.buttonPopover.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isVisiblePopover: true,
        buttonPopover: {x: px, y: py, width: width, height: height}
      });
    });
  }

  closePopover() {
    this.setState({isVisiblePopover: false});
  }
}

export default index;
