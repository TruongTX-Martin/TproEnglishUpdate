import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  BackHandler
} from 'react-native';
import {
  Container,
  Body,
  Content,
  Header,
  Button,
  Item,
  Footer
} from 'native-base';
import HeaderBase from '../../../Components/HeaderBase';
import Config from '../../../Config';
import { Localizations } from '../../../i18n';
import { EventRegister } from 'react-native-event-listeners';
import AdmobBanner from '../../../Components/AdmobBanner';
import DataService from '../../../Services/DataService';
import Constants from '../../../Config/Constant';
const { width, height } = Dimensions.get('window');

class index extends Component {
  constructor(props) {
    super(props);
    const newWord = props.navigation.state.params.newWord || null;
    this.state = {
      title: newWord ? newWord.title : '',
      meaning: newWord ? newWord.meaning : '',
      note: newWord ? newWord.note : '',
      newWord: props.navigation.state.params.newWord || null,
      connected: props.navigation.state.params.connected
    };
  }

  backToPrevious() {
    const onBack = this.props.navigation.state.params.onBack;
    if (onBack) {
      onBack();
    }
    this.props.navigation.goBack();

  }

  onAddNew() {
    if (
      this.state.title.trim().length === 0 ||
      this.state.meaning.trim().length === 0
    ) {
      Alert.alert('', Localizations('detailScreen.titleMeaningEmpty'));
      return;
    }
    const { lessonId, childCategoryId } = this.props.navigation.state.params;

    const newWord = {
      id: new Date().getTime(),
      childCategoryId,
      lessonId,
      title: this.state.title,
      meaning: this.state.meaning,
      note: this.state.note,
      isMyWord: false,
      isWrong: false
    };
    const result = DataService.addNewWord(newWord);
    if (result) {
      this.backToPrevious();
    } else {
      Alert.alert('', Localizations('detailScreen.wordExits'));
    }
  }

  onEditWord() {
    if (
      this.state.title.trim().length === 0 ||
      this.state.meaning.trim().length === 0
    ) {
      Alert.alert('', Localizations('detailScreen.titleMeaningEmpty'));
      return;
    }

    let newWord = this.state.newWord;
    const result = DataService.updateNewWord(
      newWord,
      this.state.title,
      this.state.meaning,
      this.state.note
    );
    if (result) {
      this.backToPrevious();
    } else {
      Alert.alert('', 'Từ đã tồn tại');
    }

  }

  onSubmit() {
    if (this.state.newWord) {
      //edit
      this.onEditWord();
    } else {
      //add new
      this.onAddNew();
    }
  }


  componentWillMount() {
    this.realoadAdListener = EventRegister.addEventListener(Constants.STATUS_NETWORK, (data) => {
      this.setState({
        connected: data
      })
    });
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }
  componentWillUnmount() {
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
          <HeaderBase
            title={this.state.newWord ? Localizations('detailScreen.editNewWord') : Localizations('detailScreen.addNewWord')}
            navigation={this.props.navigation}
          />
        </Header>
        <Body>
          <View style={{ backgroundColor: '#EEEEEE' }}>
            {
              this.state.connected &&
              <AdmobBanner />
            }
            <TextInput
              style={{
                width: width - 40,
                height: 40,
                marginHorizontal: 20,
                marginTop: 20,
                backgroundColor: 'white',
                borderRadius: 10,
                paddingLeft: 5
              }}
              maxLength={50}
              placeholder={Localizations('detailScreen.typeYourNewWord')}
              value={this.state.title}
              onChangeText={text => this.setState({ title: text })}
            />
            <TextInput
              style={{
                width: width - 40,
                height: 40,
                marginHorizontal: 20,
                marginTop: 10,
                backgroundColor: 'white',
                borderRadius: 10,
                paddingLeft: 5
              }}
              placeholder={Localizations('detailScreen.meaning')}
              maxLength={50}
              value={this.state.meaning}
              onChangeText={text => this.setState({ meaning: text })}
            />
            <TextInput
              style={{
                width: width - 40,
                marginHorizontal: 20,
                marginTop: 10,
                backgroundColor: 'white',
                borderRadius: 10,
                paddingLeft: 5
              }}
              multiline={true}
              maxLength={100}
              numberOfLines={4}
              minHeight={100}
              placeholder={Localizations('detailScreen.yourNote')}
              value={this.state.note}
              onChangeText={text => this.setState({ note: text })}
            />
          </View>

          <View
            style={{ width, height: 50, marginTop: 10, flexDirection: 'row' }}
          >
            <TouchableOpacity
              style={{
                width: width / 2 - 20,
                height: 40,
                backgroundColor: 'gray',
                justifyContent: 'center',
                marginHorizontal: 10,
                borderRadius: 5
              }}
              onPress={() => this.backToPrevious()}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  alignSelf: 'center'
                }}
              >
                {Localizations('detailScreen.cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: width / 2 - 20,
                height: 40,
                backgroundColor: '#00ADD8',
                justifyContent: 'center',
                marginHorizontal: 10,
                borderRadius: 5
              }}
              onPress={() => this.onSubmit()}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  alignSelf: 'center'
                }}
              >
                {this.state.newWord ? 'Lưu lại' : Localizations('detailScreen.addNew')}
              </Text>
            </TouchableOpacity>
          </View>
        </Body>
      </Container>
    );
  }
}

export default index;
