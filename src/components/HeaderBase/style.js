import { StyleSheet } from 'react-native';
import color from '../../config/Color';

export default styles = StyleSheet.create({
    parrentView: {
        flex: 1,
        flexDirection: 'row'
    },
    viewLeft: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonLeft: {
        alignSelf: 'flex-start',
        width: 50,
        height: 50,
        justifyContent: 'center',
    },
    imageButtonLeft: {
        width: 12,
        height: 21,
        marginRight: 5,
    },
    viewCenter: {
        justifyContent: 'center',
        flex: 2,
        alignItems: 'center'
    },
    textCenter: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    viewRight: {
        flex: 0.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
    }
});
