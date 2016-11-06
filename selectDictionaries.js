import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  ListView,
  TouchableHighlight
} from 'react-native';

export default class SelectDictionaries extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dictionaries: this.props.dictionaries,
      dataSource: ds.cloneWithRows(this.props.dictionaries),
      ds: ds,
    };
    this.pressBack = this.pressBack.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.switchTrigger = this.switchTrigger.bind(this);
  }
  
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.backButton} onPress={this.pressBack}>
          <Text style={styles.backButtonText}>&lt; Back</Text>
        </TouchableHighlight>
        <ListView
          enableEmptySections={true}
          style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}          
        />
      </View>
    );
  }
  
  pressBack(){
    this.props.updateDictionaries(this.state.dictionaries);
    this.props.navigator.pop();
  }
  
  renderRow(data){
    return (
      <View style={styles.row}>
        <Text style={{flex: 5}}>{data.Name}</Text>
        <Switch style={{flex: 1}} value={data.selected} onValueChange={(newValue) => this.switchTrigger(newValue, data.Id)}/>
      </View>
    );
  }
  
  switchTrigger(newValue, id){
    var dictionaries = this.state.dictionaries.slice();
    for(var i = 0; i < dictionaries.length; i++){
      var d = dictionaries[i];
      if(d.Id == id){
        d.selected = newValue;
      }
    }
    this.setState({dataSource: this.state.ds.cloneWithRows(dictionaries), dictionaries: dictionaries});
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  backButton: {
    padding: 5,
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDD',
  },
  
  backButtonText: {
    color: '#000', 
    textAlign: 'center',
    fontSize: 15,
    flex: 1,
  },

  
  list: {
    flex: 1,
    padding: 10,
  },
  
  separator: {
    height: 2,
    backgroundColor: '#8E8E8E',
  },
  
  row: {
    flexDirection: 'row',
    padding: 5,
    flex: 1
  }
});
