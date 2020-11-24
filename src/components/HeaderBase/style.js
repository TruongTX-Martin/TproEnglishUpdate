import { StyleSheet } from 'react-native';
import color from '../../Config/Color';

export default styles = StyleSheet.create({
    parrentView: {
        flex: 1,
        flexDirection: 'row',
    },
    viewLeft: {
        flex: 0.5,
        justifyContent: 'center',
    },
    buttonLeft: {
        alignSelf: 'flex-start',
        flex: 1,
        width: 50,
        justifyContent: 'center'
    },
    imageButtonLeft: {
        width: 12,
        height: 21,
        marginLeft: 5
    },
    viewCenter: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
    },
    textCenter: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    viewRight: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'flex-end',
    }
});
