'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  BackHandler,
} from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import * as commonColors from '../../styles/commonColors';
import { screenWidth, screenHeight, statusBar, navBar, subWidth, NORMAL_FONT } from '../../styles/commonStyles';
import language from '../../utils/language/language';
import Container from '../Container';

import { saveMenuSelectedID } from '../Menu/actions';

const content = require('../../../assets/imgs/services/content.png');
const eCommerce = require('../../../assets/imgs/services/cart.png');
const kentico = require('../../../assets/imgs/services/kentico.png');
const logoDesign = require('../../../assets/imgs/services/logo.png');
const maintenance = require('../../../assets/imgs/services/maintenance.png');
const media = require('../../../assets/imgs/services/media.png');
const mobile = require('../../../assets/imgs/services/mobile.png');
const seo = require('../../../assets/imgs/services/seo.png');
const web = require('../../../assets/imgs/services/web.png');
const arrow = require('../../../assets/imgs/services/arrow.png');
const arrow_ar = require('../../../assets/imgs/services/arrow_ar.png');

const lists = [web, eCommerce, logoDesign, media, content, seo, maintenance, kentico, mobile];

class Services extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      dataSource: null,
      rowID: null,
    };
  }

  componentWillMount() {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    this.props.saveMenuSelectedID(null);
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

  componentWillReceiveProps(nextProps) {
  }

  onItemSelect(data, rowID) {
    Actions.ServicesDetail({rowID: rowID, titleKey: data.titleKey});
  }

 _renderRow ({ item, index }) {
    return (
      <TouchableOpacity onPress={()=>{this.onItemSelect(item, index)}} style={styles.listWrapper}>
        <View style={styles.listView}>
          <View style={styles.leftView}>
            <Image source={ lists[index] } style={ styles.avatar} />
            <Text  style={styles.title}>{item.title}</Text>
          </View>
          <Image source={ arrow } style={ styles.arrow} />
        </View>
      </TouchableOpacity>
    )
  }
  _renderRow_ar ({ item, index }) {
    return (
      <TouchableOpacity onPress={()=>{this.onItemSelect(item, index)}} style={styles.listWrapper}>
        <View style={styles.listView}>
          <Image source={ arrow_ar } style={ styles.arrow} />
          <View style={styles.leftView}>
            <Text  style={styles.title_ar}>{item.title}</Text>
            <Image source={ lists[index] } style={ styles.avatar} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _renderSeparator () {
    return (
      <View
        style={{ height: 1, backgroundColor: commonColors.separateGray, flex:1}}
      />
    );
  }

  render() {
    const { currentLanguage } = this.props;

    /* **** data for ListView **** */
    const serviceItems = [
      {id: 1, title: language.sWebsite[currentLanguage], titleKey: "sWebsite"},
      {id: 2, title: language.sEcommerce[currentLanguage], titleKey: "sEcommerce"},
      {id: 3, title: language.sLogoDesign[currentLanguage], titleKey: "sLogoDesign"},
      {id: 4, title: language.sMultimediaCD[currentLanguage], titleKey: "sMultimediaCD"},
      {id: 5, title: language.sContentSolution[currentLanguage], titleKey: "sContentSolution"},
      {id: 6, title: language.sSeo[currentLanguage], titleKey: "sSeo"},
      {id: 7, title: language.sMaintanence[currentLanguage], titleKey: "sMaintanence"},
      {id: 8, title: language.sKentico[currentLanguage], titleKey: "sKentico"},
      {id: 9, title: language.sMobile[currentLanguage], titleKey: "sMobile"},
    ];

    return (
      <Container currentLanguage={currentLanguage} pageTitle="services">
        <View style={ styles.container } >
          {currentLanguage == 'EN'
          ? <FlatList
              data={serviceItems}
              keyExtractor={item => item.id}
              renderItem={this._renderRow.bind(this)}
              ItemSeparatorComponent={this._renderSeparator}
              enableEmptySections
            />
          : <FlatList
              data={serviceItems}
              keyExtractor={item => item.id}
              renderItem={this._renderRow_ar.bind(this)}
              ItemSeparatorComponent={this._renderSeparator}
              enableEmptySections
            />
          }
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    backgroundColor: commonColors.title,
  },
  listWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    height: (screenHeight-8-navBar) / 9,
    backgroundColor: commonColors.title,
  },
  listView: {
    width: subWidth,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#000',
    fontSize: 16,
    backgroundColor: 'transparent',
    marginLeft: 20,
    fontFamily: NORMAL_FONT,
  },
  title_ar: {
    color: '#000',
    fontSize: 16,
    backgroundColor: 'transparent',
    marginRight: 20,
    fontFamily: NORMAL_FONT,
  },
});

export default connect(state => ({
  currentLanguage: state.language.currentLanguage,
}),{ saveMenuSelectedID })(Services);