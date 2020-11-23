import React, { Component } from 'react';
import {
    View, Dimensions, Alert, BackHandler
} from 'react-native';
import { Container, Body, Header, Footer } from 'native-base';
import Config from '../../config';
import HeaderBase from '../../components/HeaderBase';
import Loading from '../../components/Loading';
import Pdf from 'react-native-pdf';
import { inject, observer } from 'mobx-react';
import AdmobBanner from '../../components/AdmobBanner';
import { EventRegister } from 'react-native-event-listeners'
import { showInterstitialAd } from '../../utils';
import DataService from '../../service/DataService';
const { width, height } = Dimensions.get('window');

@inject('detailStore')
@observer
class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            story: props.navigation.state.params.story || null,
            connected: true
        };
    }

    componentDidMount() {
        if (!DataService.getShowAdmobDetail()) {
            showInterstitialAd();
            DataService.setShowAdmobDetail(true);
        }
        const { story } = this.state;
        if (story?.isView?.length == 0) {
            DataService.updateStory(story?.id);
        }
    }

    componentWillMount() {
        this.realoadAdListener = EventRegister.addEventListener(Config.Constant.STATUS_NETWORK, (connected) => {
            this.setState({
                connected
            });
        });
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonClick,
        );
    }

    handleBackButtonClick() {
        EventRegister.emit(Config.Constant.EVENT_RELOAD_DATA, '')
        return false;
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.realoadAdListener);
    }


    render() {
        const { story } = this.state;
        const source = { uri: story?.urlFile, cache: true };
        return (
            <Container>
                <Header style={Config.Styles.header}>
                    <HeaderBase
                        title={this.state.story ? this.state.story.name : ''}
                        navigation={this.props.navigation}
                        onBack={() => EventRegister.emit(Config.Constant.EVENT_RELOAD_DATA, '')}
                    />
                </Header>
                <Body>
                    <View style={{ flex: 1, width }}>
                        <Loading visible={this.props.detailStore.downloading || source === null} color='#46A6D4' />
                        {
                            source != null &&
                            <Pdf
                                source={source}
                                style={{ flex: 1, width, height: height - 300 }}
                                onError={(error) => {
                                    Alert.alert('', 'Điện thoại không có kết nối. Bật kết nối mạng để tiếp tục đọc truyện.')
                                }}
                            />
                        }
                    </View>
                </Body>
                {
                    this.state.connected &&
                    <Footer style={{
                        backgroundColor: '#000000',
                        borderTopColor: '#427ef7',
                        borderTopWidth: 1,
                    }}>
                        <AdmobBanner />
                    </Footer>
                }
            </Container>
        );
    }
}

export default index;