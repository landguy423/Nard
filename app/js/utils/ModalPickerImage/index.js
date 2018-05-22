'use strict';

import React from 'react';
import PropTypes from 'prop-types'

import {
    View,
    StyleSheet,
    Dimensions,
    Modal,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    Image
} from 'react-native';

import styles from './style';
import BaseComponent from './BaseComponent';

let componentIndex = 0;

class ModalPicker extends BaseComponent {

    constructor() {

        super();

        this._bind(
            'onChange',
            'open',
            'close',
            'renderChildren'
        );

        this.state = {
            animationType: 'slide',
            modalVisible: false,
            transparent: false,
            selected: 'please select',
            data: []
        };
    }

    componentDidMount() {
        this.setState({selected: this.props.initValue});
        this.setState({cancelText: this.props.cancelText});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({data: nextProps.data});
    }

    onChange(item) {
        this.props.onChange(item);
        this.setState({selected: item.label});
        this.close();
    }

    close() {
      this.setState({
        modalVisible: false
      });
    }

    open() {
      this.setState({
        modalVisible: true
      });
    }

    renderSection(section) {
        return (
            <View key={section.key} style={[styles.sectionStyle,this.props.sectionStyle]}>
                <Text style={[styles.sectionTextStyle,this.props.sectionTextStyle]}>{section.label}</Text>
            </View>
        );
    }

    renderOption(option) {
      //Saudi Arabia, UAE, Morocco, Spain, Singapore, Palastin
      if (option.dialCode == '+966' || (option.dialCode == '+212' && option.label.indexOf('Western Sahara')) || option.dialCode == '+34' || 
                option.dialCode == '+65' || option.dialCode == '+970' || option.dialCode == '+971' || option.dialCode == '+973') 
      {
        return (
          <TouchableOpacity key={option.key} onPress={()=>this.onChange(option)}>
            <View style={[styles.optionStyle, this.props.optionStyle, {flex:1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
              <View style={styles.leftContent}>
                <View>
                  <Image source={option.image} resizeMode='stretch' style={{width: 30, height: 16}}/>  
                </View>
                <View style={{alignItems:'flex-end'}}>
                  <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color:'grey', fontSize: 12}]}>{option.dialCode}</Text>
                </View>
              </View>
              {/* <View style={{flex:0.15, alignItems:'flex-end'}}>
                <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color:'grey', fontSize: 12}]}>{option.dialCode}</Text>
              </View>
              <View style={{flex:0.7, alignItems: 'center'}}>
                <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color: '#434343', fontSize: 14}]}>{option.label}</Text>
              </View> */}
              {option.dialCode === '+971' && (
                <View style={styles.rightContent}>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color:'grey', fontSize: 12}]}>United Arab Emirates</Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color: '#434343', fontSize: 14}]}>الإمارات العربية المتحدة</Text>
                  </View>
                </View>
              )}
              {option.dialCode === '+973' && (
                <View style={styles.rightContent}>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color:'grey', fontSize: 12}]}>Bahrain</Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color: '#434343', fontSize: 14}]}>البحرين</Text>
                  </View>
                </View>
              )}
              {option.dialCode === '+970' && (
                <View style={styles.rightContent}>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color:'grey', fontSize: 12}]}>Palestine</Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color: '#434343', fontSize: 14}]}>فلسطين</Text>
                  </View>
                </View>
              )}
              {option.dialCode === '+212' && (
                <View style={styles.rightContent}>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color:'grey', fontSize: 12}]}>Morocco</Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color: '#434343', fontSize: 14}]}>المملكة المغربية</Text>
                  </View>
                </View>
              )}
              {option.dialCode === '+65' && (
                <View style={styles.rightContent}>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color:'grey', fontSize: 12}]}>Singapore</Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color: '#434343', fontSize: 14}]}>سنغافورة</Text>
                  </View>
                </View>
              )}
              {option.dialCode === '+34' && (
                <View style={styles.rightContent}>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color:'grey', fontSize: 12}]}>Spain</Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color: '#434343', fontSize: 14}]}>إسبانيا</Text>
                  </View>
                </View>
              )}
              {option.dialCode === '+966' && (
                <View style={styles.rightContent}>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color:'grey', fontSize: 12}]}>Kingdom of Saudi Arabia</Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle, {color: '#434343', fontSize: 14}]}>المملكة العربية السعودية</Text>
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>)
        }
    }

    renderOptionList() {
        var options = this.state.data.map((item) => {
            if (item.section) {
                return this.renderSection(item);
            } else {
                return this.renderOption(item);
            }
        });

        return (
            <View style={[styles.overlayStyle, this.props.overlayStyle]} key={'modalPicker'+(componentIndex++)}>
                <View style={styles.optionContainer}>
                    <ScrollView keyboardShouldPersistTaps='always'>
                        <View style={{paddingHorizontal:10}}>
                            {options}
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.cancelContainer}>
                    <TouchableOpacity onPress={this.close}>
                        <View style={[styles.cancelStyle, this.props.cancelStyle]}>
                            <Text style={[styles.cancelTextStyle,this.props.cancelTextStyle]}>{this.props.cancelText}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>);
    }

    renderChildren() {

        if(this.props.children) {
            return this.props.children;
        }
    }

    render() {

        const dp = (
          <Modal transparent={true} ref="modal" visible={this.state.modalVisible} onRequestClose={this.close} animationType={this.state.animationType}>
          {this.renderOptionList()}
          </Modal>
        );

        return (
            <View style={this.props.style}>
                {dp}
                <TouchableOpacity onPress={this.open}>
                    {this.renderChildren()}
                </TouchableOpacity>
            </View>
        );
    }
}

ModalPicker.propTypes = {
  data: PropTypes.array,
  onChange: PropTypes.func,
  initValue: PropTypes.string,
  style: View.propTypes.style,
  selectStyle: View.propTypes.style,
  optionStyle: View.propTypes.style,
  optionTextStyle: Text.propTypes.style,
  sectionStyle: View.propTypes.style,
  sectionTextStyle: Text.propTypes.style,
  cancelStyle: View.propTypes.style,
  cancelTextStyle: Text.propTypes.style,
  overlayStyle: View.propTypes.style,
  cancelText: PropTypes.string
};

ModalPicker.defaultProps = {
  data: [],
  onChange: ()=> {},
  initValue: 'Select me!',
  style: {},
  selectStyle: {},
  optionStyle: {},
  optionTextStyle: {},
  sectionStyle: {},
  sectionTextStyle: {},
  cancelStyle: {},
  cancelTextStyle: {},
  overlayStyle: {},
  cancelText: 'cancel'
};

export default ModalPicker