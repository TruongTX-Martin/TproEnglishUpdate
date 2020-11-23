import React, { Component } from 'react';
import { Button } from 'native-base';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Images from '../../assets/images';
import { capitalize } from '../../utils';
import styles from './style';

class index extends Component {

    render() {
        return (
            <View style={styles.parrentView}>
                <View style={styles.viewLeft}>
                    {
                        this.props.navigation && (
                            <TouchableOpacity
                                style={styles.buttonLeft}
                                onPress={() => {
                                    this.props.navigation.goBack();
                                    this.props.onBack && this.props.onBack();
                                }}
                            >
                                <Image
                                    style={styles.imageButtonLeft}
                                    source={Images.imageArrowLeftWhite}
                                />
                            </TouchableOpacity>
                        )
                    }
                </View>
                <View style={styles.viewCenter}>
                    <Text style={styles.textCenter}>{this.props.title.split(' ')
                        .map((e) => capitalize(e))
                        .join(' ') || ''}</Text>
                </View>
                <View style={styles.viewRight}>
                    {
                        this.props.setting &&
                        <TouchableOpacity onPress={() => this.props.handleSetting && this.props.handleSetting()}>
                            <Image style={{ width: 40, height: 40 }} source={Images.imgIcSetting} />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        );
    }

}

export default index;