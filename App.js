import React from 'react';
import { Text, View, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Criar from './components/criar'
import Tabuleiros from './components/tabuleiro'
import Jogo from './components/jogo'
import ICON from './assets/STABLE.png';
const Stack = createStackNavigator();

class Principal extends React.Component{
  render(){
    return(
    <View style={{backgroundColor:"#d9d9d9"}}>
      <Text>{" "}</Text>
      <Text>{" "}</Text>
      <View style={{justifyContent: 'center',alignItems: 'center'}}>
        <Image source={ICON} style={{ width: 300, height: 300 }} />
      </View>
      <Text>{" "}</Text>
      <Text>{" "}</Text>
      <Button title="Tabuleiros" onPress={()=>this.goToPagina01()}></Button>
      <Text>{" "}</Text>
      <Button title="Criar Tabuleiro" onPress={()=>this.goToPagina02()}></Button>
    </View>
    )
  }

  goToPagina01(){
    this.props.navigation.navigate("Tabuleiros");
  }

  goToPagina02(){
    this.props.navigation.navigate("Criar");
  }
}

class App extends React.Component {

  render() {
    return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Stable Roll" component={Principal}/>
        <Stack.Screen name="Tabuleiros" component={Tabuleiros} />
        <Stack.Screen name="Criar" component={Criar} />
        <Stack.Screen name="Jogo" component={Jogo} />
      </Stack.Navigator>
    </NavigationContainer>
    )
  }
}

export default App;
