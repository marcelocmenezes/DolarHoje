import React, { Component } from 'react'
import { TouchableOpacity,Text, View, TouchableHighlightBase, StyleSheet, Platform, Dimensions, ScrollView, RefreshControl } from 'react-native'
import DollarRepository from './src/repositories/DollarRepository';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      dollars:[],
      lastUpdate: null,
      refreshing:false
    }
  }
  componentDidMount(){
      this.load();
  }
  load = async () =>{
    let result = await DollarRepository.getNow();
    if(result)
      this.setState({dollars:result.docs, lastUpdate: result.updateDate});
  }
  onRefresh = () => {
      this.setState({refreshing: true});
      this.load();
      this.setState({refreshing: false});
  }
  renderDollarRow(row){
    return(
      <View>
        <Text>{row.bidvalue}</Text>
      </View>
    );
  }
  renderSelect(text, index){
    return(
      <TouchableOpacity style={styles.tab} onPress={() => this.setState({index:index})}>
        <Text style={(index != this.state.index ? styles.tabText : styles.tabTextSelected)}>{text}</Text>
      </TouchableOpacity>
    );
}
  render() {
    const {
      dollars,
      lastUpdate
    } = this.state;
    const tab1 = this.renderSelect('INTRADAY',0); 
    const tab2 = this.renderSelect('HISTORICO',1); 
    const values = dollars.slice(1).map(row => this.renderDollarRow(row))
    return (
      <View style={styles.container}>
        <ScrollView        
          refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }
          >
          <Text style={styles.title}> Dolar Hoje </Text>
          {dollars.length > 0  ? 
            <>
            <View style={styles.row}>
              <View style={styles.halfView}>
                    <Text style={styles.subtitle}> COMPRA </Text>
                    <Text style={{...styles.valueDefault, fontSize: 25,}}><Text style={styles.rs}>R$</Text> {dollars[0].bidvalue} </Text>
              </View>
              <View style={styles.halfView}>
                    <Text style={styles.subtitle}> VENDA </Text>
                    <Text style={{...styles.valueDefault, fontSize: 25,}}><Text style={styles.rs}>R$</Text> {dollars[0].askvalue} </Text>
              </View>
              <View style={styles.thirdView}>
                    <Text style={styles.subtitle}> MÁXIMO (DIA) </Text>
                    <Text style={styles.valueDefault}><Text style={styles.rs}>R$</Text> {dollars[0].maxbid} </Text>
              </View>
              <View style={styles.thirdView}>
                    <Text style={styles.subtitle}> MÍNIMO (DIA) </Text>
                    <Text style={styles.valueDefault}><Text style={styles.rs}>R$</Text> {dollars[0].minbid} </Text>
              </View>
              <View style={styles.thirdView}>
                    <Text style={styles.subtitle}> VARIAÇÃO </Text>
                    <Text  style={{...styles.valueDefault, color: (dollars[0].variationpercentbid > 0 ? '#20c634' : '#d5150b')}}> {dollars[0].variationpercentbid} <Text style={styles.rs}>%</Text></Text>
              </View>
              {lastUpdate && <Text style={styles.update}> Ultima Atualização {(new Date(lastUpdate)).toLocaleDateString()} {(new Date(lastUpdate)).toLocaleTimeString()}</Text>}
            </View>
            {/* <View style={styles.tabSelect}>
              {tab1}
              {tab2}
            </View>
            <View>
            {values}
            </View> */}
            </>
          :
          <Text style={styles.title}> Carregando... </Text>
          }
        </ScrollView>
      </View>
    )
  }
}
const width = Dimensions.get('screen').width;
const width50 = width * 0.5;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424'
  },
  title: {
    fontSize: 25,
    fontWeight:'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    margin: 10,
    marginTop: 20
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'left',
    color: '#afafaf',
    margin: 5,
  },
  rs: {
    fontSize: 12,
    textAlign: 'left',
    color: '#afafaf',
    margin: 5,
  },
  valueDefault: {
    fontSize: 20,
    textAlign: 'left',
    color: '#FFFFFF',
    margin: 5,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  halfView: {
    width:'50%',
    
  },
  thirdView: {
    width:'33%'
  },
  update: {
    fontSize: 12,
    textAlign: 'left',
    color: '#afafaf',
    margin: 5,
  },
  tabSelect:{
    backgroundColor: '#FFF',
		flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tab:{
    backgroundColor: '#FFFFFF',
    width: '50%',
    padding:10,
    borderColor: '#afafaf',
    borderWidth: 1
  },
  tabText:{
    textAlign: 'center'
  },
  tabTextSelected:{
    textAlign: 'center',
    color: '#afafaf'
  }
});
