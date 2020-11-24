import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';
import { Container, Body, Content, Header, Footer, Button } from 'native-base';
import HeaderBase from '../../Components/HeaderBase';
import Carousel from 'react-native-snap-carousel';
import { Localizations } from '../../i18n';
import Config from '../../Config';
import DataService from '../../Services/DataService';
import { getTopAndBottomHeight } from '../../Helper/StatusBar';
import Images from '../../Assets/Images';
var { height, width } = Dimensions.get('window');
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listImage: [
        {
          image: Images.imageTurorial1
        },
        {
          image: Images.imageTurorial2
        },
        {
          image: Images.imageTurorial3
        },
        {
          image: Images.imageTurorial4
        },
        {
          image: Images.imageTurorial5
        },
        {
          image: Images.imageTurorial6
        },
        {
          image: Images.imageTurorial7
        }
      ],
      page: 0,
      listIndicator: [0, 1, 2, 3, 4, 5, 6]
    };
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  onAndroidBackPress = () => {
    return true;
  }

  renderItem({ item }) {
    return (
      <View>
        <Image
          style={{
            width: ((height - getTopAndBottomHeight() - 30) * 750) / 1334,
            height: height - getTopAndBottomHeight() - 30
          }}
          source={item.image}
        />
      </View>
    );
  }

  onBack() {
    if (this.state.page > 0) {
      this.setState({ page: this.state.page - 1 });
    }
  }

  onNext() {
    if (this.state.page < this.state.listIndicator.length - 1) {
      this.setState({ page: this.state.page + 1 });
    }
    if (this.state.page === this.state.listIndicator.length - 1) {
      this.props.navigation.goBack();
      DataService.setFirstTime('true');
      const onDone = this.props.navigation.state.params.onDone;
      if (onDone) {
        onDone();
      }
    }
  }

  render() {
    return (
      <Container>
        <Header style={Config.Styles.header}>
          <HeaderBase title={Localizations('settingScreen.tutorial')} />
        </Header>
        <Body>
          <Content>
            <View style={{width, alignItems: 'center', backgroundColor: '#D8D8D8'}}>
              <View
                style={{
                  width: ((height - getTopAndBottomHeight() - 30) * 750) / 1334,
                  height: height - getTopAndBottomHeight() - 30
                }}
              >
                <Carousel
                  style={{ flex: 1 }}
                  ref={c => {
                    this._carousel = c;
                  }}
                  data={this.state.listImage}
                  renderItem={this.renderItem}
                  sliderWidth={width}
                  itemWidth={width}
                  layout={'default'}
                  onSnapToItem={index => this.setState({ page: index })}
                  firstItem={this.state.page}
                />
              </View>
              <View
                style={{flexDirection: 'row', width, justifyContent: 'center', height: 30, alignItems: 'center' }}
              >
                <View style={{ position: 'relative', flexDirection: 'row' }}>
                  {this.state.listIndicator.map(e => (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginRight: 10,
                        backgroundColor:
                          this.state.page === e ? '#00ADD8' : 'gray'
                      }}
                    />
                  ))}
                </View>
              </View>
            </View>
          </Content>
        </Body>
        <Footer style={{ backgroundColor: 'white'}}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <TouchableOpacity
                style={{
                  width: width / 2 - 50,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'gray',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={() => this.onBack()}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Back</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <TouchableOpacity
                style={{
                  width: width / 2 - 50,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#00ADD8',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={() => this.onNext()}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Footer>
      </Container>
    );
  }
}

export default index;
