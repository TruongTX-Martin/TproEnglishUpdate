import React, { Component } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Container, Body, Content, Header, Footer } from 'native-base';
import Config from '../../config';
import HeaderBase from '../../components/HeaderBase';
import Loading from '../../components/Loading';
import Images from '../../assets/images';
import AdmobBanner from '../../components/AdmobBanner';
import { capitalize } from '../../utils';
import { inject, observer } from 'mobx-react';
import { EventRegister } from 'react-native-event-listeners';


const { width } = Dimensions.get('window');

@inject('listStoryStore')
@observer
class index extends Component {


    constructor(props) {
        super(props);
        this.state = {
            category: props.navigation.state.params.category || null,
            connected: true
        };
    }

    componentDidMount() {
        this.getData();
    }


    getData() {
        this.props.listStoryStore.getListStory(this.state.category.id);
    }

    componentWillMount() {
        this.realoadAdListener = EventRegister.addEventListener(Config.Constant.STATUS_NETWORK, (connected) => {
            if (connected && this.props.listStoryStore.listStory.length === 0) {
                this.props.listStoryStore.getListStory(this.state.category.id);
            }
            this.setState({
                connected
            });
        });
        this.reloadData = EventRegister.addEventListener(Config.Constant.EVENT_RELOAD_DATA, () => {
            this.getData();
        });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.realoadAdListener);
        EventRegister.removeEventListener(this.reloadData);
    }

    gotoStoryDetail(item) {
        this.props.navigation.navigate('Detail', { story: item });
    }
    renderItem({ item, index }) {
        return (
            <TouchableOpacity
                style={{ width }}
                onPress={() => this.gotoStoryDetail(item)}
            >
                <View style={{ flexDirection: 'row', width, justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 20, height: 20 }} source={item?.isView?.length > 0 ? Images.imgIcTicked : Images.imgIcUnTick} />
                        <Text style={{ paddingTop: 10, paddingBottom: 10, marginLeft: 10, fontSize: 16, width: width - 50 }}>
                            {item?.name
                                .split(' ')
                                .map((e) => capitalize(e))
                                .join(' ')}
                        </Text>
                    </View>
                    <Image
                        style={{ width: 20, height: 20, marginLeft: 3 }}
                        source={Images.imageArrowRightBlack}
                    />
                </View>
                <View style={{ width, height: 1, backgroundColor: '#CACACA' }} />
            </TouchableOpacity>
        );
    }

    render() {
        const { listStoryStore, navigation } = this.props;
        const { loading, listStory } = listStoryStore;
        const { category } = this.state;
        return (
            <Container>
                <Header style={Config.Styles.header}>
                    <HeaderBase
                        navigation={navigation}
                        title={category?.title || ''}
                    />
                </Header>
                <Body>
                    <Content showsVerticalScrollIndicator={false}>
                        <Loading visible={loading} />
                        {
                            listStory?.length > 0 && !loading &&
                            <FlatList
                                extraData={listStory}
                                data={listStory}
                                keyExtractor={(item, index) => item?.id?.toString()}
                                renderItem={(item, index) => this.renderItem(item, index)}
                            />
                        }
                        {
                            !loading && listStory.length == 0 && <TouchableOpacity
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width, marginTop: 20 }}
                                onPress={() => this.getData()}
                            >
                                <Text style={{ textAlign: 'center' }}>Tải lại dữ liệu</Text>
                                <Image style={{ width: 50, height: 50, marginTop: 20 }} source={Images.imgIcReload} />
                            </TouchableOpacity>
                        }
                    </Content>
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
