import { createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { fromRight } from 'react-navigation-transitions';
import HomeScreen from '../Home';
import DetailScreen from '../Detail';
import ListStoryScreen from '../ListStory';
import SettingScreen from '../Setting';

const stackNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        header: null,
        drawerLockMode: 'locked-open',
      })
    },
    Setting: {
      screen: SettingScreen,
      navigationOptions: () => ({
        header: null,
        drawerLockMode: 'locked-open',
      })
    },
    ListStory: {
      screen: ListStoryScreen,
      navigationOptions: () => ({
        header: null,
        drawerLockMode: 'locked-open',
      })
    },
    Detail: {
      screen: DetailScreen,
      navigationOptions: () => ({
        header: null,
        drawerLockMode: 'locked-closed'
      })
    },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => fromRight(600)
  }
);

export default createAppContainer(stackNavigator);

