import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';
  
import LookUp from './lookUp';
import SelectDictionaries from './selectDictionaries';

export default class Dictionary extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (   
      <Navigator
        initialRoute={{ 
          name:'LookUp', 
          index: 0,
          initial: true,
          passProps:{
            dictionaries: []
          }
        }}
        renderScene={this.renderScene}
      />
    );
  }
  
  renderScene(route, navigator) {
    if(route.name == 'LookUp') {
        return <LookUp navigator={navigator} {...route.passProps}/>
    }
    if(route.name == 'SelectDictionaries') {
      return <SelectDictionaries navigator={navigator} {...route.passProps}/>
    }
  }
}

AppRegistry.registerComponent('Dictionary', () => Dictionary);
