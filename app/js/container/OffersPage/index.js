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
import OrientationLoadingOveraly from 'react-native-orientation-loading-overlay';

import * as commonColors from '../../styles/commonColors';
import { screenWidth, screenHeight, statusBar, navBar, NORMAL_FONT, NORMAL_BOLD_FONT } from '../../styles/commonStyles';
import Container from '../Container';

import { saveMenuSelectedID } from '../Menu/actions';
import { getOffers, initialStore } from './actions';
import { logout } from '../LoginPage/actions';
import { changeTokenStatus } from '../ParentComponent/actions';

const arrow = require('../../../assets/imgs/my_services/arrow.png');
const arrow_ar = require('../../../assets/imgs/my_services/arrow_ar.png');

class Offers extends Component {
  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      dataSource: null,
      rowID: null,
      backColors: [commonColors.lightYellow, commonColors.detailTitleBar, commonColors.grayTitleText],
      allOffers: [],
      offerList: [],
    };
  }

  componentWillMount() {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    const { userInfoResult, apiToken, loggin } = this.props;

    if (loggin) {
      this.props.saveMenuSelectedID(2)
    }
    else {
      this.props.saveMenuSelectedID(1);  
    }
    const data = {mail: userInfoResult.data.client_data.email};
    this.props.getOffers(data, apiToken.api_token);
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
    const {offersData, userInfoResult, currentLanguage, loggin, token_status, loading} = nextProps;

    this.setState({loading: loading});

    if (offersData) {
      if (offersData === "token_failed") {
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
        this.setState({allOffers: offersData.data.offers});
        let data = offersData.data.offers;
        let index = currentLanguage == "EN" ? 0 : 1;
        let offerList = [];
        for (let i = 0; i < data.length; i ++) {
          offerList.push({id: (i + 1), title: data[i].text[index].title, subTitle: data[i].text[index].title});
        }
        this.setState({offerList: offerList, allOffer: data});
      }
    }
  }

  onAddService() {
    Actions.StartProject();
  }

  onItemSelect(data, rowID) {
    Actions.OffersDetail({rowID: rowID, offerData: this.state.allOffer});
  }

 _renderRow({ item, index }) {
    return (
      <View style={{
                  backgroundColor: this.state.backColors[index % 3],
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: screenWidth,
                  height: (screenHeight-12-navBar) / 4}}
      >
        <TouchableOpacity onPress={()=>{this.onItemSelect(item, index)}}>
          <View style={styles.listView}>
            <View style={styles.titleWrapper}>
              <Text  style={styles.offerTitle}>{item.title}</Text>
            </View>
            <Image source={ arrow } style={ styles.arrow } />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _renderRow_ar({ item, index }) {
    return (
      <View style={{
                  backgroundColor: this.state.backColors[index % 3],
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: screenWidth,
                  height: (screenHeight-12-navBar) / 4}}
      >
        <TouchableOpacity onPress={()=>{this.onItemSelect(item, index)}}>
          <View style={styles.listView}>
            <Image source={ arrow_ar } style={ styles.arrow } />
            <View style={styles.titleWrapper_ar}>
              <Text  style={styles.offerTitle_ar}>{item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _renderSeparator () {
    return (
      <View
        style={{ height: 4, backgroundColor: '#fff', flex:1}}
      />
    );
  }

  render() {
    const { currentLanguage } = this.props;
    const { offerList, loading } = this.state;

    return (
      <Container currentLanguage={currentLanguage} pageTitle="offers">
        <OrientationLoadingOveraly visible={ loading } />
        <View style={ styles.container } >
          {currentLanguage=='EN'
          ? <FlatList
              data={offerList}
              keyExtractor={item => item}
              renderItem={this._renderRow.bind(this)}
              ItemSeparatorComponent={this._renderSeparator}
              enableEmptySections
            />
          : <FlatList
              data={offerList}
              keyExtractor={item => item}
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
    height: screenHeight - navBar,
    backgroundColor: '#fff',
  },
  listView: {
    width: screenWidth * 0.85,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrapper: {
    paddingRight: 40,
  },
  titleWrapper_ar: {
    paddingLeft: 40,
  },
  offerTitle: {
    color: commonColors.title,
    fontSize: 20,
    backgroundColor: 'transparent',
    marginBottom: 5,
    fontFamily: NORMAL_BOLD_FONT,
  },
  offerTitle_ar: {
    color: commonColors.title,
    fontSize: 20,
    backgroundColor: 'transparent',
    marginBottom: 5,
    textAlign: 'right',
    fontFamily: NORMAL_BOLD_FONT,
  },
  offerSubTitle: {
    color: commonColors.title,
    fontSize: 18,
    backgroundColor: 'transparent',
    fontFamily: NORMAL_FONT,
  },
  offerSubTitle_ar: {
    color: commonColors.title,
    fontSize: 18,
    backgroundColor: 'transparent',
    textAlign: 'right',
    fontFamily: NORMAL_FONT,
  },
  arrow: {
  },
  scrollArrow: {
    position: 'absolute',
    bottom: 0,
  },
});

export default connect(state => ({
  currentLanguage: state.language.currentLanguage,
  offersData: state.offers.data,
  loading: state.offers.loading,

  userInfoResult: state.auth.userInfoResult,
  token_status: state.parent_state.token_status,
  apiToken: state.parent_state.apiToken,
  loggin: state.auth.loggin,
}),{ saveMenuSelectedID, getOffers, logout, changeTokenStatus, initialStore })(Offers);