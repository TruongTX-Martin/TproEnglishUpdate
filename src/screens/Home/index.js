import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Container, Body, Content, Header, Footer } from 'native-base';
import Config from '../../config';
import Localization from '../../localization';
import HeaderBase from '../../components/HeaderBase';
import Loading from '../../components/Loading';
import Images from '../../assets/images';
import AdmobBanner from '../../components/AdmobBanner';
import { EventRegister } from 'react-native-event-listeners'
import { capitalize } from '../../utils';
import { inject, observer } from 'mobx-react';

const { width } = Dimensions.get('window');
@inject('homeStore')
@observer
class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            connected: true
        };
    }

    componentDidMount() {
        const timeout = setTimeout(() => {
            this.props.homeStore.getListCategory();
            clearTimeout(timeout);
        }, 1000);
    }

    componentWillMount() {
        this.realoadAdListener = EventRegister.addEventListener(Config.Constant.STATUS_NETWORK, (connected) => {
            if (connected && this.props.homeStore.listCategory.length === 0) {
                this.props.homeStore.getListCategory();
            }
            this.setState({
                connected
            });
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.realoadAdListener);
    }

    gotoListStory(item) {
        this.props.navigation.navigate('ListStory', { category: item });
    }

    render() {
        const { listCategory, loading } = this.props.homeStore;
        const { connected } = this.state;
        return (
            <Container>
                <Header style={Config.Styles.header}>
                    <HeaderBase
                        title={Localization.homeScreen.titleHeader}
                        setting
                        handleSetting={() => this.props.navigation.navigate('Setting')}
                    />
                </Header>
                <Body>
                    <Content>
                        <View>
                            <Loading visible={loading} color='#46AdD4' />
                            <Text style={{ textAlign: 'center', fontSize: 20, color: 'black', fontWeight: 'bold', marginVertical: 10 }}>Hãy đọc những câu truyện kinh thánh cho con trẻ</Text>
                            {
                                listCategory.length > 0 &&
                                listCategory.map(item => (
                                    <View>
                                        <TouchableOpacity
                                            key={item.id}
                                            style={{ width }}
                                            onPress={() => this.gotoListStory(item)}
                                        >
                                            <View style={{ flexDirection: 'row', width, justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={{ paddingTop: 10, paddingBottom: 10, marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>
                                                    {item?.title
                                                        .split(' ')
                                                        .map((e) => capitalize(e))
                                                        .join(' ')}
                                                </Text>
                                                <Image
                                                    style={{ width: 20, height: 20, marginLeft: 3 }}
                                                    source={Images.imageArrowRightBlack}
                                                />
                                            </View>
                                        </TouchableOpacity>

                                        <View style={{ width, height: 1, backgroundColor: '#CACACA' }} />
                                    </View>
                                ))
                            }
                            {
                                !loading && listCategory.length == 0 && <TouchableOpacity
                                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width, marginTop: 20 }}
                                    onPress={() => this.props.homeStore.getListCategory()}
                                >
                                    <Text style={{ textAlign: 'center' }}>Tải lại dữ liệu</Text>
                                    <Image style={{ width: 50, height: 50, marginTop: 20 }} source={Images.imgIcReload} />
                                </TouchableOpacity>
                            }
                        </View>
                    </Content>
                </Body>
                {
                    connected &&
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
