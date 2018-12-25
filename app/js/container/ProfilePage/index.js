'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Alert,
  Platform,
  BackHandler,
  ImageBackground,
} from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import OrientationLoadingOveraly from 'react-native-orientation-loading-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as commonColors from '../../styles/commonColors';
import { screenWidth, screenHeight, statusBar, navBar, inputMargin, subWidth, NORMAL_FONT } from '../../styles/commonStyles';
import language from '../../utils/language/language';
import Container from '../Container';
import {updateProfile, initialStore} from './actions';
import {logout} from '../LoginPage/actions';
import { getProfileData } from '../LoginPage/actions';
import { changeTokenStatus } from '../ParentComponent/actions';

const avatar_img = require('../../../assets/imgs/profile/avatar.png');
const name_img = require('../../../assets/imgs/start_project/full_name.png');
const name_img_ar = require('../../../assets/imgs/start_project/full_name_ar.png');
const email_img = require('../../../assets/imgs/start_project/mail.png');
const email_img_ar = require('../../../assets/imgs/start_project/mail_ar.png');
const phone_img = require('../../../assets/imgs/start_project/phone.png');
const phone_img_ar = require('../../../assets/imgs/start_project/phone_ar.png');
const company_img = require('../../../assets/imgs/start_project/company.png');
const company_img_ar = require('../../../assets/imgs/start_project/company_ar.png');
const update_img = require('../../../assets/imgs/main/yellow_button.png');
const pressBtn_img = require('../../../assets/imgs/main/blue_button.png');

class Profile extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      company: '',
      name: '',
      phone: '',
      email: '',
      content: '',
      loading: false,
      alert_flag: false,
    };
  }

  componentWillMount() {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    const {userInfoResult, currentLanguage} = this.props;

    if (userInfoResult) {
      this.setDataState(userInfoResult.data, currentLanguage);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === "android") {
      BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
    }
  }

  handleBackButtonClick() {
    Actions.Main();
    return true;
  }

  setDataState(userData, currentLanguage) {
    if (currentLanguage == 'EN') {
      this.setState({company: userData.client_descriptions[1].company_name});
      this.setState({name: userData.client_descriptions[1].title});
      this.setState({phone: userData.client_data.mobile});
      this.setState({email: userData.client_data.email});
    }
    else {
      this.setState({company: userData.client_descriptions[2].company_name});
      this.setState({name: userData.client_descriptions[2].title});
      this.setState({phone: userData.client_data.mobile});
      this.setState({email: userData.client_data.email});
    }
  }

  componentWillReceiveProps(nextProps) {
    const {profileUpdateResult, userInfoResult, currentLanguage, loggin, loading, token_status, apiToken} = nextProps;
    // const userData = userInfoResult.data;
    this.setState({loading: loading});
    
    if (profileUpdateResult) {
      if (profileUpdateResult === "token_failed") {
        if (token_status) {
          this.props.changeTokenStatus(false);
        }
        this.props.logout();
        if (!loggin && !token_status) {
          this.props.initialStore();
          Actions.Login();
        }
        return;
      }
      else {
        if (!this.state.alert_flag && !loading) {
          this.setState({alert_flag: true}); 
          if (profileUpdateResult.error) {   //warning
            setTimeout(()=> {
              Alert.alert("WARNING",  profileUpdateResult.error.warning);
            }, 100);
          }
          else {
            setTimeout(()=> {
              if (currentLanguage == 'EN') {
                Alert.alert('Congratulation !', 'Your profile updated with success' );
              } else {
                Alert.alert('تهانينا !', 'تم تحديث بياناتكم بنجاح' );
              }
            }, 100);
            
            //get updated profile data again
            const email = userInfoResult.data.client_data.email;
            const phoneNumber = userInfoResult.data.client_data.mobile;
            if (apiToken) {
              const data = { email: email, telephone: phoneNumber };
              this.props.getProfileData(data, apiToken.api_token);
            }
          }
        }
      }
    }
  }

  onUpdate() {
    const { currentLanguage, userInfoResult, apiToken } = this.props;
    const { company, name, phone, email, content } = this.state;

    this.setState({alert_flag: false}); 

    const data = {
      title: name,
      company_name: company,
      email: email,
      mobile: phone,
      clients_id: userInfoResult.data.client_data.clients_id,
      language_id: currentLanguage == 'EN' ? 1 : 2,
    }
    this.props.updateProfile(data, apiToken.api_token);
  }

  render() {
    const { currentLanguage, userInfoResult } = this.props;
    let { company, name, phone, email, content, loading } = this.state;

    let firstName = ''
    if (userInfoResult) {
      firstName = userInfoResult.data.client_data.title[0]
    }

    return (
      <Container currentLanguage={currentLanguage} pageTitle="null">
        <OrientationLoadingOveraly visible={ loading } />
        <View style={ styles.container } >
          <KeyboardAwareScrollView>
            <View style={ styles.subContainer } >
              <ImageBackground source={avatar_img} style={ styles.avatar } resizeMode="contain" >
                <Text  style={ styles.avatarText }>{firstName}</Text>
              </ImageBackground>
              <View style={{flex:0.7}}>
                <ImageBackground source={company_img} style={ styles.inputImg } resizeMode="contain" >
                  <TextInput
                    ref="company"
                    autoCapitalize="none"
                    autoCorrect={ false }
                    placeholder={language.company[currentLanguage]}
                    placeholderTextColor={ commonColors.placeholderTextGray }
                    textAlign="left"
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    returnKeyType={ 'next' }
                    value={ company }
                    onChangeText={ (text) => this.setState({ company: text }) }
                    onSubmitEditing={ () => this.refs.name.focus() }
                  />
                </ImageBackground>
                <ImageBackground source={name_img} style={ styles.inputImg } resizeMode="contain" >
                  <TextInput
                    ref="name"
                    autoCapitalize="none"
                    autoCorrect={ false }
                    placeholder={language.fullName[currentLanguage]}
                    placeholderTextColor={ commonColors.placeholderTextGray }
                    textAlign="left"
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    returnKeyType={ 'next' }
                    value={ name }
                    onChangeText={ (text) => this.setState({ name: text }) }
                    onSubmitEditing={ () => this.refs.phone.focus() }
                  />
                </ImageBackground>
                <ImageBackground source={phone_img} style={ styles.inputImg } resizeMode="contain" >
                  <TextInput
                    ref="phone"
                    autoCapitalize="none"
                    autoCorrect={ false }
                    placeholder={language.phone[currentLanguage]}
                    placeholderTextColor={ commonColors.placeholderTextGray }
                    textAlign="left"
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    returnKeyType={ 'next' }
                    keyboardType="numbers-and-punctuation"
                    value={ phone }
                    onChangeText={ (text) => this.setState({ phone: text }) }
                    onSubmitEditing={ () => this.refs.email.focus() }
                  />
                </ImageBackground>
                <ImageBackground source={email_img} style={ styles.inputImg } resizeMode="contain" >
                  <TextInput
                    ref="email"
                    autoCapitalize="none"
                    autoCorrect={ false }
                    placeholder={language.email[currentLanguage]}
                    placeholderTextColor={ commonColors.placeholderTextGray }
                    textAlign="left"
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    returnKeyType={ 'next' }
                    keyboardType="email-address"
                    value={ email }
                    onChangeText={ (text) => this.setState({ email: text }) }
                    onSubmitEditing={ () => this.refs.content.focus() }
                  />
                </ImageBackground>
                <View style={styles.buttonWrapper}>
                  <TouchableHighlight
                    onShowUnderlay={()=>this.setState({pressStatus: true})}
                    onHideUnderlay={()=>this.setState({pressStatus: false})}
                    underlayColor={'#fff'}
                    onPress={ () => this.onUpdate() }
                  >
                    <ImageBackground source={ this.state.pressStatus ? pressBtn_img : update_img } style={ styles.button } resizeMode="contain" >
                      <Text style={ styles.textButton }>{language.update[currentLanguage]}</Text>
                    </ImageBackground>
                  </TouchableHighlight>
                </View>
              </View>
              {/* <View style={{flex:0.7}}>
                <ImageBackground source={company_img_ar} style={ styles.inputImg } resizeMode="contain" >
                  <TextInput
                    ref="company"
                    autoCapitalize="none"
                    autoCorrect={ false }
                    placeholder={language.company[currentLanguage]}
                    placeholderTextColor={ commonColors.placeholderTextGray }
                    textAlign="right"
                    style={styles.input_ar}
                    underlineColorAndroid="transparent"
                    returnKeyType={ 'next' }
                    value={ company }
                    onChangeText={ (text) => this.setState({ company: text }) }
                    onSubmitEditing={ () => this.refs.name.focus() }
                  />
                </ImageBackground>
                <ImageBackground source={name_img_ar} style={ styles.inputImg } resizeMode="contain" >
                  <TextInput
                    ref="name"
                    autoCapitalize="none"
                    autoCorrect={ false }
                    placeholder={language.fullName[currentLanguage]}
                    placeholderTextColor={ commonColors.placeholderTextGray }
                    textAlign="right"
                    style={styles.input_ar}
                    underlineColorAndroid="transparent"
                    returnKeyType={ 'next' }
                    value={ name }
                    onChangeText={ (text) => this.setState({ name: text }) }
                    onSubmitEditing={ () => this.refs.phone.focus() }
                  />
                </Image>
                <Image source={phone_img_ar} style={ styles.inputImg } resizeMode="contain" >
                  <TextInput
                    ref="phone"
                    autoCapitalize="none"
                    autoCorrect={ false }
                    placeholder={language.phone[currentLanguage]}
                    placeholderTextColor={ commonColors.placeholderTextGray }
                    textAlign="right"
                    style={styles.input_ar}
                    underlineColorAndroid="transparent"
                    returnKeyType={ 'next' }
                    keyboardType="numbers-and-punctuation"
                    value={ phone }
                    onChangeText={ (text) => this.setState({ phone: text }) }
                    onSubmitEditing={ () => this.refs.email.focus() }
                  />
                </ImageBackground>
                <ImageBackground source={email_img_ar} style={ styles.inputImg } resizeMode="contain" >
                  <TextInput
                    ref="email"
                    autoCapitalize="none"
                    autoCorrect={ false }
                    placeholder={language.email[currentLanguage]}
                    placeholderTextColor={ commonColors.placeholderTextGray }
                    textAlign="right"
                    style={styles.input_ar}
                    underlineColorAndroid="transparent"
                    returnKeyType={ 'next' }
                    keyboardType="email-address"
                    value={ email }
                    onChangeText={ (text) => this.setState({ email: text }) }
                    onSubmitEditing={ () => this.refs.content.focus() }
                  />
                </ImageBackground>
                <View style={styles.buttonWrapper}>
                  <TouchableHighlight
                    onShowUnderlay={()=>this.setState({pressStatus: true})}
                    onHideUnderlay={()=>this.setState({pressStatus: false})}
                    underlayColor={'#fff'}
                    onPress={ () => this.onUpdate() }
                  >
                    <ImageBackground source={ this.state.pressStatus ? pressBtn_img : update_img } style={ styles.button } resizeMode="contain" >
                      <Text style={ styles.textButton }>{language.update[currentLanguage]}</Text>
                    </ImageBackground>
                  </TouchableHighlight>
                </View>
              </View>
              } */}
            </View>
          </KeyboardAwareScrollView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight - navBar,
    backgroundColor: commonColors.title,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems:'center',
    width: 80,
  },
  avatarText: {
    color: commonColors.title,
    fontSize: 40,
    backgroundColor: 'transparent',
    fontFamily: NORMAL_FONT,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    width: screenWidth,
    height: screenHeight - navBar,
  },
  inputImg: {
    justifyContent: 'center',
    width: subWidth,
    marginTop: 10,
    height: 60,
  },
  input: {
    fontSize: 14,
    color: commonColors.text,
    alignSelf: 'stretch',
    marginLeft: inputMargin,
    fontFamily: NORMAL_FONT,
  },
  input_ar: {
    fontSize: 14,
    color: commonColors.text,
    alignSelf: 'stretch',
    marginRight: inputMargin,
    fontFamily: NORMAL_FONT,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
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
  loading: state.profile.loading,
  userInfoResult: state.auth.userInfoResult,
  currentLanguage: state.language.currentLanguage,
  profileUpdateResult: state.profile.data,
  apiToken: state.parent_state.apiToken,
  loggin: state.auth.loggin,
  token_status: state.parent_state.token_status,
}),{ updateProfile, changeTokenStatus, getProfileData, logout, initialStore })(Profile);