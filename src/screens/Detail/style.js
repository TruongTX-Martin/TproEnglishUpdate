import { StyleSheet, Dimensions,Platform } from 'react-native';
const { width } = Dimensions.get('window');
export default (styles = StyleSheet.create({
  viewTab: {
    flexDirection: 'row',
    height: 50,
    width,
  },
  tab: {
    flex: 1,
    backgroundColor: '#00ADD8',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  viewText: {
    flex: 1,
    height: 49,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTab: {
    color: '#EEEEEE',
    fontSize: 13,
    fontWeight: 'bold'
  },
  textTabSelected: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  tabLineBottom: {
    height: 3,
    backgroundColor: '#00ADD8',
    width: width / 3
  },
  tabLineBottomSelected: {
    height: 4,
    backgroundColor: 'red',
    width: width / 3
  },

  viewMessage: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: 'column',
    justifyContent: "space-between",
  },
  modalMessage: {
    fontSize: 16,
    height: Platform.OS === 'android' ? 32 : 20
  },
  modalView: {
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between',
    flex:1,
    paddingBottom: Platform.os === 'ios' ? 0 : 48
  },
  buttonModalLeft: {
    flex: 1,
    backgroundColor: '#505F79',
    height: 48,
    borderBottomLeftRadius : 5,
    alignItems:'center',
    justifyContent:'center'
  },
  buttonModalRight: {
    flex: 1,
    backgroundColor: '#4A90E2',
    height: 48,
    borderBottomRightRadius : 5,
    alignItems:'center',
    justifyContent:'center'
  },
  modalContent: {
    backgroundColor: "white",
    alignItems: "center",
    flexDirection: 'column',
    justifyContent: "space-between",
    borderRadius: 5,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  white: {
    color : '#fff',
    fontSize:14
  },
  track: {
    height: 3,
    borderRadius: 2,
  },
  thumb: {
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: '#00ADD8',
  },
}));
