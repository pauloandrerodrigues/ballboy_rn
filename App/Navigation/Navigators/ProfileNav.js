import React from 'react';
import { StackNavigator } from 'react-navigation';
import I18n from '../../I18n';
import StackBackHeader from '../StackBackHeader';
import LoggedInRoute from '../LoggedInRoute';
import LoginScreen from '../../Screens/LoginScreen';
import SignupScreen from '../../Screens/SignupScreen';
import ProfileSignupScreen from '../../Screens/Profile/ProfileSignupScreen';
import ProfileDetailsScreen from '../../Screens/Profile/ProfileDetailsScreen';
import ProfileEditScreen from '../../Screens/Profile/ProfileEditScreen';
import style from './style';

const { headerTitleStyle } = style;

const ProfileNav = StackNavigator({
  LoginScreen: {
    screen: ({ navigation }) => (
      <LoginScreen
        navigation={navigation}
        onSuccessHook={() => {
          // Reset navigation after success login
          navigation.popToTop();
        }}
      />
    ),
    navigationOptions: ({ navigation }) => ({
      headerTitle: I18n.t('Hi again!'),
      headerTitleStyle,
      headerLeft: (
        <StackBackHeader
          onPress={() => { navigation.goBack(null); }}
        />
      ),
    }),
  },
  SignupScreen: {
    screen: ({ navigation }) => (
      <SignupScreen
        navigation={navigation}
        onSuccessHook={() => {
          // Reset navigation after success signup
          navigation.popToTop();
        }}
      />
    ),
    navigationOptions: ({ navigation }) => ({
      headerTitle: I18n.t('Sign up'),
      headerTitleStyle,
      headerLeft: (
        <StackBackHeader
          onPress={() => { navigation.goBack(null); }}
        />
      ),
    }),
  },
  ProfileEditScreen: {
    screen: () => (
      <LoggedInRoute
        component={ProfileEditScreen}
        overlay={ProfileSignupScreen}
      />
    ),
    navigationOptions: ({ navigation }) => ({
      headerTitle: I18n.t('Profile Edit'),
      headerTitleStyle,
      headerLeft: (
        <StackBackHeader
          onPress={() => { navigation.goBack(null); }}
        />
      ),
    }),
  },
  ProfileDetailsScreen: {
    screen: () => (
      <LoggedInRoute
        component={ProfileDetailsScreen}
        overlay={ProfileSignupScreen}
      />
    ),
    navigationOptions: () => ({
      headerTitle: I18n.t('Profile'),
    }),
  },
}, {
  initialRouteName: 'ProfileDetailsScreen',
});

export default ProfileNav;
