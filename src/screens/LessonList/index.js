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
import { Container, Body, Content, Header, Footer } from 'native-base';
import Config from '../../Config';
import HeaderBase from '../../Components/HeaderBase';
import Images from '../../Assets/Images';
import { EventRegister } from 'react-native-event-listeners';
import DataService from '../../Services/DataService';
import Constants from '../../Config/Constant';
import Spinner from 'react-native-loading-spinner-overlay';
import AdmobBanner from '../../Components/AdmobBanner';
import { Localizations } from '../../i18n';
import Loading from '../../Components/Loading';

var { height, width } = Dimensions.get('window');
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      listLesson: [],
      connected: props.navigation.state.params.connected
    };
    const firebase = require("firebase");
    this.database = firebase.database();
  }

  componentDidMount() {
    this.getListFormDB();
  }

  reloadData() {
    const childCategory = this.props.navigation.state.params.childCategory;
    this.getListLesson(childCategory);
  }

  getListFormDB() {
    const childCategory = this.props.navigation.state.params.childCategory;
    const arrDB = DataService.getListData(Constants.LESSON, 'childCategoryId', childCategory.id);
    if (arrDB.length < 1) {
      if (this.state.connected) {
        this.getListLesson(childCategory);
      } else {
        Alert.alert('', Localizations('listLesson.netWorkError'));
      }
    } else {
      let newArr = arrDB.map(item => {
        return {
          ...item,
          id: item.id,
          isSubmit: item.isSubmit,
          total: item.total,
          score: item.score,
          childCategoryId: item.childCategoryId,
          transcripts: item.transcripts,
          url: DataService.decryptText(item.url, Constants.USE_FOR_ME),
          title: DataService.decryptText(item.title, Constants.USE_FOR_ME),
          questions: item.questions.map(e => {
            return {
              ...e,
              question: DataService.decryptText(e.question, Constants.USE_FOR_ME),
              answers: e.answers,
            };
          })
        }
      });
      newArr = newArr.sort((a, b) => a?.title.localeCompare(b?.title));
      this.setState({ listLesson: newArr })
    }
  }



  getListLesson = childCategory => {
    this.setState({ loading: true })
    this.database
      .ref('item')
      .orderByChild('childCategoryId')
      .equalTo(childCategory.id)
      .on('value', snapshot => {
        if (snapshot.val()) {
          let arr = [];
          for (let key in snapshot.val()) {
            arr.push({
              id: key,
              isSubmit: false,
              total: 0,
              score: 0,
              ...snapshot.val()[key]
            });
          }
          let newArr = arr.map(item => {
            return {
              ...item,
              id: item.id,
              isSubmit: item.isSubmit,
              total: item.total,
              score: item.score,
              childCategoryId: item.childCategoryId,
              transcripts: item.transcripts,
              url: DataService.encryptText(item.url, Constants.USE_FOR_ME),
              title: DataService.encryptText(item.title, Constants.USE_FOR_ME),
              questions: item.questions.map(e => {
                return {
                  ...e,
                  question: DataService.encryptText(e.question, Constants.USE_FOR_ME),
                  answers: e.answers,
                };
              })
            }
          });
          DataService.saveListLesson(newArr);
          newArr = newArr.sort((a, b) => a?.title.localeCompare(b?.title));
          this.setState({
            listLesson: arr,
            loading: false
          });
        } else {
          this.setState({ listLesson: [], loading: false });
        }
      });
  };

  gotoDetailLesson(item) {
    this.props.navigation.navigate('Detail', {
      lesson: item,
      childCategoryId: this.props.navigation.state.params.childCategory.id,
      connected: this.state.connected,
      onBack: () => {
        this.getListFormDB();
        //dispatch event when user comeback from detail screen
        EventRegister.emit(Constants.RELOAD_LISTWORD);
      }
    });
  }

  caculateScore(score, total) {
    return (score / total) * 100;
  }

  componentWillMount() {
    this.realoadAdListener = EventRegister.addEventListener(Constants.STATUS_NETWORK, (connected) => {
      this.setState({
        connected
      });
      if (connected && this.state.listLesson.length === 0) {
        this.getListFormDB();
      }
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

  renderItem({ item, index }) {
    return (
      <View>
        <TouchableOpacity
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          onPress={() => this.gotoDetailLesson(item)}
        >
          <View style={{ width: width - 40 }}>
            <Text
              style={{
                fontSize: 16,
                marginTop: 10,
                marginBottom: item.isSubmit ? 0 : 10,
                marginHorizontal: 5
              }}
            >
              {item.title}
            </Text>
            {
              item.isSubmit &&
              <Text style={{ marginHorizontal: 5, fontSize: 12, marginVertical: 5, color: this.caculateScore(item.score, item.total) > 79 ? '#00ADD8' : 'red', fontWeight: 'bold' }}>{Localizations('listLesson.score')}: {item.score}/{item.total}</Text>
            }
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

  render() {
    let { listLesson, loading } = this.state;
    return (
      <Container>
        <Header style={Config.Styles.header}>
          <HeaderBase title={Localizations('listLesson.listLesson')} navigation={this.props.navigation} />
        </Header>
        <Body>
          <Content showsVerticalScrollIndicator={false}>
            <Loading visible={loading} color={'#00A8D9'} styles={{ marginTop: 50 }} />
            {
              !loading && listLesson.length == 0 && <TouchableOpacity
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width, marginTop: 20 }}
                onPress={() => this.reloadData()}
              >
                <Text style={{ textAlign: 'center' }}>Tải lại dữ liệu</Text>
                <Image style={{ width: 50, height: 50, marginTop: 20 }} source={Images.imageIcReload} />
              </TouchableOpacity>
            }
            <FlatList
              extraData={listLesson}
              data={listLesson}
              keyExtractor={(item, index) => item?.id?.toString()}
              renderItem={(item, index) => this.renderItem(item, index)}
              showsVerticalScrollIndicator={false}
            />
          </Content>
        </Body>
        {
          this.state.connected &&
          <Footer style={{ backgroundColor: 'black' }}>
            <AdmobBanner />
          </Footer>
        }
      </Container>
    );
  }
}

export default index;
