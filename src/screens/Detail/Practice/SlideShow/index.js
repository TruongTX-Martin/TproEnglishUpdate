import React, { Component } from 'react';
import { Dimensions, View, Text, Image, TouchableOpacity,BackHandler } from 'react-native';
import { Container, Body, Content, Header, Footer } from 'native-base';
import Config from '../../../../Config';
import HeaderBase from '../../../../Components/HeaderBase';
import Images from '../../../../Assets/Images';
import * as Animatable from 'react-native-animatable';
import AdmobBanner from '../../../../Components/AdmobBanner';
import { EventRegister } from 'react-native-event-listeners';
import Constants from '../../../../Config/Constant';
var { height, width } = Dimensions.get('window');
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      newWords: [],
      index: 0,
      currentWord: null,
      connected: props.navigation.state.params.connected
    };
    this.handleViewRef = ref => (this.view = ref);
  }

  componentDidMount() {
    this.getNewWordsDB();
  }

  onAndroidBackPress = () => {
    this.props.navigation.goBack();
    return true;
  }


  autoNextWord() {
    setTimeout(() => {
      this.onWordNext();
      if(this.state.index < this.state.newWords.length -1) {
        this.autoNextWord();
      }
    }, 2000);
  }

  getNewWordsDB() {
    const newWords = this.props.navigation.state.params.newWords
    const currentWord = newWords[0];
    this.setState({
      newWords: newWords,
      currentWord
    },() => {
      if(newWords.length > 1){
        this.autoNextWord();
      }
    });
  }

  onWordBack() {
    if(this.view){
      this.view.slideInLeft(500);
      let currentIndex = this.state.index;
      currentIndex -= 1;
      const currentWord = this.state.newWords[currentIndex];
      this.setState({
        index: currentIndex,
        currentWord
      });
    }
  }

  onWordNext() {
    if(this.view && this.state.index < this.state.newWords.length -1) {
      this.view.slideInRight(500);
      let currentIndex = this.state.index;
      currentIndex += 1;
      const currentWord = this.state.newWords[currentIndex];
      this.setState({
        index: currentIndex,
        currentWord
      });
    }
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
          <HeaderBase title={'Slide Show'} navigation={this.props.navigation} />
        </Header>
        <Body>
          <Content>
              <View style={{ flex: 1}}>
                <View style={{ marginTop: height / 4}}>
                  <Text style={{ textAlign: 'center', marginBottom: 10, fontSize: 16, fontWeight: 'bold'}}>{this.state.index+1}/{this.state.newWords.length}</Text>
                </View>
                <Animatable.View ref={this.handleViewRef} useNativeDriver={true}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: 50 }}>
                    {this.state.index > 0 && (
                      <TouchableOpacity onPress={() => this.onWordBack()}>
                        <Image
                          style={{ width: 40, height: 50, marginTop:15 }}
                          source={Images.imageArrowLeftBlack}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{ width: width - 100, height }}>
                    {currentWord != null && (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: 'gray',
                          borderRadius: 5,
                          paddingVertical: 10
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            textAlign: 'center'
                          }}
                        >
                          {currentWord.title}
                        </Text>
                        <Text style={{ fontSize: 16, marginLeft: 20 }}>
                          {currentWord.meaning}
                        </Text>
                        <Text style={{ fontSize: 18, marginLeft: 20 }}>
                          {currentWord.note}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{ height, width: 50 }}>
                    {this.state.index < this.state.newWords.length - 1 && (
                      <TouchableOpacity onPress={() => this.onWordNext()}>
                        <Image
                          style={{ width: 40, height: 50,marginTop:15 }}
                          source={Images.imageArrowRightBlack}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                </Animatable.View>
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
