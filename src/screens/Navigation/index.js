import { createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { fromRight } from 'react-navigation-transitions';
import HomeScreen from '../Home';
import DetailScreen from '../Detail';
import AddNewWordScreen from '../Detail/AddNewWord';
import LessonListScreen from '../LessonList';
import SlideShowScreen from '../Detail/Practice/SlideShow';
import FillWordScreen from '../Detail/Practice/FillWord';
import QuizzScreen from '../Detail/Practice/QuizzGame';
import SettingScreen from '../Setting';
import TutorialScreen from '../Tutorial';


const stackNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        header: null,
        drawerLockMode: 'locked-open',
      })
    },
    Detail: {
      screen: DetailScreen,
      navigationOptions: () => ({
        header: null,
        drawerLockMode: 'locked-open',
      })
    },
    LessonList: {
      screen: LessonListScreen,
      navigationOptions: () => ({
        header: null,
        drawerLockMode: 'locked-open',
      })
    },
    AddNewWord: {
      screen: AddNewWordScreen,
      navigationOptions: () => ({
        header: null,
        drawerLockMode: 'locked-open',
      })
    },
    SlideShowScreen: {
      screen: SlideShowScreen,
      navigationOptions: () => ({
        header: null,
        drawerLockMode: 'locked-open',
      })
    },
    FillWord: {
      screen: FillWordScreen,
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
    Quizz: {
      screen: QuizzScreen,
      navigationOptions: () => ({
        header: null,
        drawerLockMode: 'locked-open',
      })
    },
    Tutorial: {
      screen: TutorialScreen,
      navigationOptions: () => ({
        header: null,
        drawerLockMode: 'locked-open',
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
