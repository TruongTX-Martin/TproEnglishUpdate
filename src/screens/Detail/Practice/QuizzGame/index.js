import React, { Component } from 'react';
import { Dimensions, View, Text, Image, TouchableOpacity, Alert,BackHandler } from 'react-native';
import { Container, Body, Content, Header,Footer } from 'native-base';
import Config from '../../../../Config';
import HeaderBase from '../../../../Components/HeaderBase';
import DataService from '../../../../Services/DataService';
import { EventRegister } from 'react-native-event-listeners'
import Constants from '../../../../Config/Constant';
import Images from '../../../../Assets/Images';
import { Localizations } from '../../../../i18n';
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
      isAnswer: false,
      result: false,
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
    },() => {
      this.setState({
        listAnswers: this.getListAnswerRandom(this.state.newWords, this.state.index)
      })
    });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  onWordNext() {
    if(this.state.index === this.state.newWords.length -1) return;
    this.setState({
      index: this.state.index + 1,
      currentWord: this.state.newWords[this.state.index + 1],
      listAnswers: this.getListAnswerRandom(this.state.newWords,this.state.index + 1),
      isAnswer: false
    })
  }

  showViewAnswers() {
    function getTitleItem(index){
      switch(index){
        case 0:
          return 'A';
        case 1:
          return 'B';
        case 2:
          return 'C';
        case 3:
          return 'D';
        default:
          return 'A';
      }
    }
    const view = this.state.listAnswers.map((itemAnswer, index) => {
      return (
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center'}}
          onPress={() => this.handleSelectedAnswer(index, itemAnswer)}
          >
          <Image
                style={{ width: 15, height: 15, marginRight: 5}}
                source={
                  itemAnswer.selected
                    ? Images.imageRadioSelected
                    : Images.imageRadio
                }
          />
          <Text >
              {getTitleItem(index)}: </Text>
          <Text style={{ 
              color: this.state.isAnswer && itemAnswer.selected && !itemAnswer.checked ? 'red' : 'black',
              fontWeight:  this.state.isAnswer && itemAnswer.checked ? 'bold' : 'normal',
              textDecorationLine: this.state.isAnswer && itemAnswer.checked ? 'underline' : 'none',
              }}>{itemAnswer.title}</Text>
        </TouchableOpacity>
      );
    })
    return (
      <View>
        {view}
        <View style={{alignItems: 'center', marginTop: 10}}>
            {
              this.state.isAnswer &&  (
                <View style={{ alignItems: 'center', marginBottom: 5}}>
                <Image
                  style={{ width: 30, height: 30}}
                  source={
                    this.state.result ? Images.imageRightAnswer : Images.imageWrongAnswer
                  }
                  />
                  <Text style={{ color: this.state.result ? '#00ADD8' : 'red'}}>{this.state.result ? 'Đúng' :'Sai'}</Text>
                </View>
              )
            }
          <TouchableOpacity 
            style={{ width: 100, height: 30,borderRadius: 5, backgroundColor: this.isAnswer() ?  '#00ADD8' : 'gray',alignItems: 'center', justifyContent: 'center'}}
            onPress={() => this.submitAnswer()}
            >
            <Text style={{ color: 'white', fontWeight: 'bold'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  isAnswer(){
    return this.state.listAnswers.filter(e => e.selected === true).length > 0;
  }

  submitAnswer() {
    if(this.state.isAnswer) return;
    if(!this.isAnswer()) return;
    this.setState({ 
      isAnswer: true,
      result: this.state.listAnswers.filter(e => e.checked === true &&  e.selected === true).length > 0 ? true: false
     }, () => {
       if(!this.state.result){
         DataService.addToMyWordWrong(this.state.currentWord, true);
         this.setState({
          numberWrong: this.state.numberWrong + 1
         },() => this.showMessageDone())
       }else{
         DataService.addToMyWordWrong(this.state.currentWord, false);
         this.showMessageDone()
       }
     });

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

  handleSelectedAnswer(index, item){
    if(this.state.isAnswer) return;
    const listAnswers = this.state.listAnswers;
    for (let i=0; i < listAnswers.length; i++) {
      if(item.selected){
        listAnswers[i].selected = false;
      }else{
        if(index === i){
          listAnswers[i].selected = true;
        }else{
          listAnswers[i].selected = false;
        }
      }
    }
    this.setState({ listAnswers });
  }

  getListAnswerRandom(listInput, index){
    const listIndex = listInput.map((e,index) =>  index);
    const list = [];
    list.push(index);
    listIndex.splice(index,1);
    const random1 = Math.floor(Math.random() * listIndex.length);
    list.push(listIndex[random1]);
    listIndex.splice(random1,1)
    const random2 = Math.floor(Math.random() * listIndex.length);
    list.push(listIndex[random2]);
    listIndex.splice(random2,1)
    const random3 = Math.floor(Math.random() * listIndex.length);
    list.push(listIndex[random3]);

    const listIndexResult = this.shuffleArray(list);
    const listResult = listInput.filter((item, index) => {
      if(listIndexResult.indexOf(index) != -1){ 
        return item;
      }
    }).map(e => {
      if(listInput.indexOf(e) === index){
        return {
          ...e,
          checked: true,
          selected: false
        }
      }
      return  {
        ...e,
        checked: false,
        selected: false
      }
    });
    return listResult;
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
      this.setState({ answer: true });
    }else{
      this.setState({ answer: false });
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
    })
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
                      paddingBottom:10,
                      paddingTop: 10
                    }}
                  >
                    {
                      currentWord != null && 
                      <Text style={{ fontSize: 16, marginLeft: 20, fontWeight: 'bold' }}>
                        Which word has meaning "{currentWord.meaning}" ?
                      </Text>
                    }
                    {
                      currentWord != null && currentWord.note.length > 0 && 
                      <Text style={{ fontSize: 14, marginLeft: 20, color: '#0095C1'}}>
                      {currentWord != null ? '(' + currentWord.note + ')': ''}
                      </Text>
                    }
                  </View>
                  <View style={{ marginTop: 30 }}>
                    {this.state.listAnswers.length >  0 && this.showViewAnswers()}
                  </View>
                </View>
              </View>
              <View style={{ height, width: 50, marginTop: height / 3 + 20 }}>
                {this.state.isAnswer && this.state.index < this.state.newWords.length - 1 && (
                  <TouchableOpacity onPress={() => this.onWordNext()}>
                    {
                      this.state.isAnswer && (
                        <Image
                          style={{ width: 40, height: 50 }}
                          source={Images.imageArrowRightBlack}
                        />
                      )
                    }
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Content>
        </Body>
        {
          this.state.connected && 
          <Footer>
            <AdmobBanner/>
          </Footer>
        }
      </Container>
    );
  }
}

export default index;
