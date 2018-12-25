'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  findNodeHandle,
  AsyncStorage,
  BackHandler,
  Platform,
  ImageBackground,
} from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import OrientationLoadingOveraly from 'react-native-orientation-loading-overlay';

import * as commonColors from '../../styles/commonColors';
import { screenWidth, screenHeight, statusBar, navBar, subWidth, NORMAL_FONT, NORMAL_BOLD_FONT } from '../../styles/commonStyles';
import language from '../../utils/language/language';
import Container from '../Container';

import { userLoginIn } from '../LoginPage/actions';
import { saveMenuSelectedID } from '../Menu/actions';
import { getServices, initialMainStore } from './actions';
import { logout } from '../LoginPage/actions';
import { initialStore } from "../ProfilePage/actions";

const background = require('../../../assets/imgs/main/back.png');
const imgBlue = require('../../../assets/imgs/main/blue_button.png');
const imgYellow = require('../../../assets/imgs/main/yellow_button.png');
const menu = require('../../../assets/imgs/main/menu.png');

class Main extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      loading: false,
    };
  }

  componentWillMount() {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    const {apiToken} = this.props;
    this.props.saveMenuSelectedID(0);
    if (apiToken) {
      this.props.getServices(apiToken.api_token);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === "android") {
      BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
    }
  }

  handleBackButtonClick() {
    this.props.logout();
    this.props.initialStore();
    Actions.Login();
    return true;
  }

  
  componentWillReceiveProps(nextProps) {
    const {loading, userInfoResult, rememberMe, apiToken } = nextProps;
    this.setState({loading: loading});
    if (rememberMe) {
      if (userInfoResult) {
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfoResult));
        AsyncStorage.setItem('userToken', JSON.stringify(apiToken.api_token));
      }
    }
  }

  onStartProject() {
    Actions.StartProject();
  }

  onServices() {
    Actions.Services();
  }

  render() {
    const { currentLanguage } = this.props;
    const { loading } = this.state;

    return (
      <Container currentLanguage={currentLanguage} pageTitle="null" >
          <OrientationLoadingOveraly visible={ loading } />
          <ImageBackground source={ background } style={ styles.background } >
            <View style={ styles.container } >
              <View style={ styles.wrapper_title }>
                <Text style={ styles.textTitle }>{language.mainPageTitle[currentLanguage]}</Text>
              </View>
              <View style={ styles.wrapper_content }>
                <Text style={ styles.textContent }>{language.mainPageContent_b[currentLanguage]}
                  <Text style={ styles.textContentNormal }>{language.mainPageContent_n[currentLanguage]}</Text>
                </Text>
              </View>
              <View style={ styles.buttonWrapper }>
                <TouchableOpacity
                  activeOpacity={ .5 }
                  onPress={ () => this.onStartProject() }
                >
                  <ImageBackground source={ imgYellow } style={ styles.button } resizeMode="contain">
                    <Text style={ styles.textButton }>{language.startNewProject[currentLanguage]}</Text>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={ .5 }
                  onPress={ () => this.onServices() }
                >
                  <ImageBackground source={ imgBlue } style={ styles.button } resizeMode="contain">
                    <Text style={ styles.textButton }>{language.services[currentLanguage]}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    width: screenWidth,
    height: screenHeight - navBar,
  },
  container: {
    flex: 1,
    width: subWidth,
  },
  wrapper_title: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: 15,
    textAlign: 'center',
    color: commonColors.title,
    backgroundColor: 'transparent',
    fontFamily: NORMAL_FONT,
  },
  wrapper_content: {
    flex: 0.3,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  textContent: {
    fontSize: 15,
    textAlign: 'center',
    color: commonColors.title,
    fontFamily: NORMAL_BOLD_FONT,
  },
  textContentNormal: {
    fontSize: 15,
    color: commonColors.title,
    fontFamily: NORMAL_FONT,
  },
  buttonWrapper: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: subWidth,
    height: 60,
  },
  textButton: {
    color: commonColors.title,
    fontSize: 14,
    backgroundColor: 'transparent',
    fontFamily: NORMAL_FONT,
  },
});

export default connect(state => ({
  currentLanguage: state.language.currentLanguage,

  loading: state.services.loading,
  apiToken: state.parent_state.apiToken,
  rememberMe: state.remember_me.data,
  userInfoResult: state.auth.userInfoResult,
}),{ saveMenuSelectedID, getServices, initialMainStore, initialStore, logout })(Main);