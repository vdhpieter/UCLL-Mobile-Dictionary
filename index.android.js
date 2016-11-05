/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Dictionary extends Component {
  
  constructor(props) {
    super(props);
    this.state = {saerchText: ''};
  }
  
  render() {
    return (
      <View style={styles.container}>
        <TextInput
        style={{height: 40}}
        placeholder="Type here to lookup!"
        onChangeText={(search) => this.setState({searchText})}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  
});

AppRegistry.registerComponent('Dictionary', () => Dictionary);
