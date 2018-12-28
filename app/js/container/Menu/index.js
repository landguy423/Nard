'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Linking,
    FlatList,
    ImageBackground,
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { logout } from '../LoginPage/actions';
import { changeLanguage } from '../LanguageStore/actions';
import { saveMenuSelectedID } from './actions';
import { initialStore } from "../ProfilePage/actions";
import language from '../../utils/language/language';

import { screenWidth, screenHeight, statusBar, NORMAL_FONT } from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';

const avatar = require('../../../assets/imgs/menu/avatar.png');
const arrow = require('../../../assets/imgs/menu/arrow.png');
const menu = require('../../../assets/imgs/login/menu.png');

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
        firstName: '',
        userName: '',
        dataSource: null,
        rowID: null,
    }
  }

  componentWillMount() {
    const { profileInfo } = this.props;
    if (profileInfo != null && !profileInfo.hasOwnProperty("error")) {
      this.setProfileInfo(profileInfo.data);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { profileInfo } = nextProps;
    // console.log('*******PROFILE_INFO********', profileInfo);
    if (profileInfo != null && !profileInfo.hasOwnProperty("error")) {
      this.setProfileInfo(profileInfo.data);
    }
  }

  setProfileInfo(data) {
    if (data.client_descriptions) {
      let firstName = data.client_descriptions[1].title[0];
      this.setState({
        userName: data.client_descriptions[1].title,
        firstName: firstName,
      });
    }
  }

  onItemSelect(data, rowID) {
    const {currentLanguage, menuSelectedID, loggin } = this.props;

    if (rowID == menuSelectedID) {
      //Hide menu when select the current page
      this.props.menuState();
      return;
    }

    if (loggin) {
      switch (rowID) {
        case "0": //Home
          this.props.saveMenuSelectedID(rowID);
          Actions.Main();
          return;
        case "1": //My Service
          this.props.saveMenuSelectedID(rowID);
          Actions.MyServices();
          return;
        case "2": //Spepcial Services
          this.props.saveMenuSelectedID(rowID);
          Actions.Offers();
          return;
        case "3": //My Account
          this.props.saveMenuSelectedID(rowID);
          Actions.Profile();
          return;
        case "4": //Support Ticket
          this.props.saveMenuSelectedID(rowID);
          Actions.Ticket();
          return;
        case "5": //Language
          const lang = currentLanguage == 'EN' ? 'AR' : 'EN';
          this.props.changeLanguage(lang);
          this.props.menuState();
          return;
        case "6": //Vist site (nard.sa)
          Linking.openURL("https://www.nard.sa");
          this.props.menuState();
          return;
        case "7": //Log out
          this.props.logout();
          this.props.initialStore();
          this.props.saveMenuSelectedID('null');
          Actions.Login();
          return;
        default:
          return;
      }
    }
    else {
      switch (rowID) {
        case "0": //Home
          this.props.saveMenuSelectedID(rowID);
          Actions.Main();
          return;
        case "1": //Language
          const lang = currentLanguage == 'EN' ? 'AR' : 'EN';
          this.props.changeLanguage(lang);
          this.props.menuState();
          return;
        case "2": //Vist site (nard.sa)
          Linking.openURL("https://www.nard.sa");
          this.props.menuState();
          return;
        case "3": //Loout page
          this.props.logout();
          this.props.saveMenuSelectedID('null');
          Actions.Login();
          return;
        default:
          return;
      } 
    }
  }

  onChangeMenuState() {
    this.props.menuState();
  }

 _renderRow ({ item, index }) {
   const { menuSelectedID, currentLanguage } = this.props;
    return (
      <TouchableOpacity onPress={()=> this.onItemSelect(item, index)}>
        {currentLanguage == 'EN' ?
          <View style={index == menuSelectedID ? styles.listViewSelect : styles.listView}>
            <Text  style={styles.listViewText}>{item}</Text>
            <Image source={ arrow } style={ styles.listArrow } resizeMode="contain" />
          </View> :
          <View style={index == menuSelectedID ? styles.listViewSelect : styles.listView}>
            <Image source={ arrow } style={ styles.listArrowAr } resizeMode="contain" />
            <Text  style={styles.listViewText}>{item}</Text>
          </View> 
        }
      </TouchableOpacity>
    )
  }

  _renderSeparator () {
    return (
      <View
        style={{ height: 1, backgroundColor: '#3A3A3A', flex:1}}
      />
    );
  }

  render() {
    const {currentLanguage, menuSelectedID, loggin} = this.props;
    let menuItems = [];
    
    if (loggin) {
      menuItems = [
            language.menuHome[currentLanguage],
            language.menuOurServices[currentLanguage], 
            language.menuOffer[currentLanguage], 
            language.menuEditProfile[currentLanguage],
            language.menuTicket[currentLanguage],  
            language.menuLanguage[currentLanguage],
            language.menuVisitNard[currentLanguage], 
            language.menuLogout[currentLanguage]];
    } else {
      menuItems = [
            language.menuHome[currentLanguage], 
            language.menuLanguage[currentLanguage],
            language.menuVisitNard[currentLanguage],
            language.menuLogout[currentLanguage]];
    }

    return (
      <View style={ styles.container } >
        <View style={styles.title}>
          { loggin
          ? <View>
              <ImageBackground source={ avatar } style={ styles.avatar } resizeMode="contain">
                <Text  style={ styles.avatarText }>{this.state.firstName}</Text>
              </ImageBackground>
              <Text  style={ styles.userNameText }>{this.state.userName}:</Text>
            </View>
          : <View>
              <ImageBackground source={ avatar } style={ styles.avatar } resizeMode="contain">
                <Text  style={ styles.avatarText }>G</Text>
              </ImageBackground>
              <Text  style={ styles.userNameText }>Guest</Text>
            </View>
          }
          <TouchableOpacity
            activeOpacity={ .5 }
            style={ styles.menu }
            onPress={ () => this.onChangeMenuState() }
          >
            <Image source={ menu } resizeMode="contain" style={ styles.menuIcon } />  
          </TouchableOpacity>
        </View>
        <View style={ styles.body }>
          <FlatList
            data={menuItems}
            keyExtractor={item => item}
            renderItem={this._renderRow.bind(this)}
            ItemSeparatorComponent={this._renderSeparator}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: commonColors.lightYellow,
    height: 125,
    paddingTop: 5,
  },
  body: {
    backgroundColor: commonColors.grayTitleText,
    height: screenHeight - 125,
  },
  avatar: {
    marginLeft: 20,
    marginTop: statusBar,
    justifyContent: 'center',
    width: 50,
    height: 50,
    alignItems:'center',
  },
  avatarText: {
    color: commonColors.title,
    fontSize: 25,
    backgroundColor: 'transparent',
    fontFamily: NORMAL_FONT,
  },
  userNameText: {
    marginLeft: 20,
    marginTop: 10,
    color: commonColors.title,
    fontSize: 19,
  },
  listView: {
    height: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  listViewSelect: {
    height: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#414141',
  },
  listViewText: {
    color: commonColors.title,
    fontFamily: NORMAL_FONT,
  },
  menu: {
    right: 0,
    paddingRight: 20,
    paddingTop: 20,
    position: 'absolute',
  },
  menuIcon: {
    height: 30,
    width: 30,
  },
  listArrowAr: {
    transform: [{scaleX: -1}]
  }
});

export default connect(state => ({
  myServicesData: state.menu.myServicesData,
  menuSelectedID: state.menu.menuSelectedID,
  loggin: state.auth.loggin,
}),{ changeLanguage, saveMenuSelectedID, initialStore, logout })(Menu);