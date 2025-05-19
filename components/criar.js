import React, { useState } from 'react';
import {Text, TextInput, View, Button, StyleSheet, TouchableOpacity} from 'react-native';
//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import {Canvas, Circle, Rect, Group, Skia, Path} from '@shopify/react-native-skia';
import AsyncStorage from '@react-native-async-storage/async-storage';

function BaseJogo() {
  return (
    <Group transform={[{ translateX: 0 }, { translateY: 0 }]}>
      <Rect x={10} y={10} width={270} height={490} color="lightgray" />

      <Rect x={10} y={60} width={270} height={5} color="#e0e0e0" />
      <Rect x={10} y={115} width={270} height={5} color="#e0e0e0" />
      <Rect x={10} y={170} width={270} height={5} color="#e0e0e0" />
      <Rect x={10} y={225} width={270} height={5} color="#e0e0e0" />
      <Rect x={10} y={280} width={270} height={5} color="#e0e0e0" />
      <Rect x={10} y={335} width={270} height={5} color="#e0e0e0" />
      <Rect x={10} y={390} width={270} height={5} color="#e0e0e0" />
      <Rect x={10} y={445} width={270} height={5} color="#e0e0e0" />

      <Rect x={60} y={10} width={5} height={490} color="#e0e0e0" />
      <Rect x={115} y={10} width={5} height={490} color="#e0e0e0" />
      <Rect x={170} y={10} width={5} height={490} color="#e0e0e0" />
      <Rect x={225} y={10} width={5} height={490} color="#e0e0e0" />
    </Group>
  );
}

function Parede({ x, y }) {
  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <Rect x={0} y={0} width={50} height={50} color="darkgray" />
      <Rect x={3} y={3} width={44} height={44} color="lightgray" />
      <Rect x={6} y={6} width={41} height={41} color="gray" />
      <Rect x={6} y={6} width={38} height={38} color="darkgray" />
    </Group>
  );
}
//Objeto de desviar
function Buraco({ x, y }) {
  const desviar = Skia.Path.Make();
  desviar.moveTo(-10, -10);
  desviar.lineTo(10, 10);
  desviar.lineTo(0, 0);
  desviar.lineTo(-10, 10);
  desviar.lineTo(10, -10);
  desviar.lineTo(0, 0);
  desviar.close();

  return (
    <Group transform={[{ translateX: x + 25 }, { translateY: y + 25 }]}>
      <Circle cx={0} cy={0} r={22} color="darkgray" />
      <Circle cx={0} cy={1} r={18} color="gray" />
      <Path path={desviar} color="red" strokeWidth={3} style="stroke" />
    </Group>
  );
}

//Objeto de vitoria
function Vitoria({ x, y }) {
  const bandeira = Skia.Path.Make();
  bandeira.moveTo(-8, 12);
  bandeira.lineTo(-8, -10);
  bandeira.lineTo(14, -2);
  bandeira.lineTo(-5, 6);
  bandeira.lineTo(-5, 12);
  bandeira.close();

  return (
    <Group transform={[{ translateX: x + 25 }, { translateY: y + 25 }]}>
      <Circle cx={0} cy={0} r={22} color="darkgray" />
      <Circle cx={0} cy={1} r={18} color="gray" />
      <Path path={bandeira} color="red" />
    </Group>
  );
}

function Jogador({ x, y }) {
  return (
    <Group transform={[{ translateX: x + 25 }, { translateY: y + 25 }]}>
      <Circle cx={0} cy={0} r={20} color="red" />
    </Group>
  );
}

function AreaDeCriacao({ gerAperto, tabuleiro }) {
  return (
    <View style={styles.containerB}>
      <View style={styles.containerC}>
        <Canvas style={styles.canvas}>
          <BaseJogo />
          {tabuleiro.map((qual, index) => {
            const x = 10 + (index % 5) * 55;
            const y = 10 + Math.floor(index / 5) * 55;
            switch (qual) {
              case 1:
                return <Parede key={index} x={x} y={y} />;
              case 2:
                return <Buraco key={index} x={x} y={y} />;
              case 3:
                return <Vitoria key={index} x={x} y={y} />;
              case 4:
                return <Jogador key={index} x={x} y={y} />;
              default:
                return null;
            }
          })}
        </Canvas>
        {[...Array(9)].map((_, lin) =>
          [...Array(5)].map((_, col) => (
            <TouchableOpacity
              key={`btn:${lin}/${col}`}
              style={[
                styles.gridDeToque,
                { top: 10 + lin * 55, left: 10 + col * 55 },
              ]}
              onPress={() => gerAperto(lin, col)}
            />
          ))
        )}
      </View>
    </View>
  );
}

class Criar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabuleiro: Array(45).fill(0),
      nome: undefined,
    };
  }

  aperto = (linha, coluna) => {
    let index = linha * 5 + coluna;
    let novoTabuleiro = [...this.state.tabuleiro];
    novoTabuleiro[index] = (novoTabuleiro[index] + 1) % 5;
    this.setState({ tabuleiro: novoTabuleiro });
  };

  async criar(){
    try{
      const indexJogador = this.state.tabuleiro.findIndex(e => e === 4)       ;
      const qntJogador   = this.state.tabuleiro.filter   (e => e === 4).length;
      const indexVitoria = this.state.tabuleiro.findIndex(e => e === 3)       ;
      if (!this.state.nome) {
        alert("Digite um nome");
        return;
      }else if(indexJogador == -1){
        alert("Adicione um jogador");
        return;
      }else if(qntJogador !== 1){
        alert("Apenas um jogador permitido");
        return;
      }else if(indexVitoria == -1){
        alert("Adicione pelo menos uma vitoria");
        return;
      }
      await AsyncStorage.setItem(this.state.nome, JSON.stringify(this.state.tabuleiro));
      alert("Tabuleiro criado com sucesso!");
      this.props.navigation.goBack();
      
    }catch(erro){
      alert("Erro!")
      return;
    }
  }

  render() {
    return (
      <View style={styles.containerA}>
        <Text style={styles.text}>{'Nome do tabuleiro:'}</Text>
        <TextInput
          style={styles.textBox}
          onChangeText={(texto) => this.setState({ nome: texto })}></TextInput>
        <Button title="Criar" onPress={() => this.criar()}></Button>
        <Text> </Text>
        <Button
          title="Voltar"
          onPress={() => this.props.navigation.goBack()}></Button>
        <AreaDeCriacao
          gerAperto={this.aperto}
          tabuleiro={this.state.tabuleiro}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerA: {
    flex: 1,
  },
  containerB: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerC: {
    flex: 1,
    width: 290,
    height: 510,
    position: 'relative',
  },
  canvas: {
    width: 290,
    height: 510,
    backgroundColor: 'gray',
  },
  gridDeToque: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(208 ,208 ,208 ,0.2)',
  },
  text: {
    fontSize: 22,
    marginTop: 10,
  },
  textBox: {
    fontSize: 20,
    marginTop: 10,
    backgroundColor: 'lightgray',
  },
});

export default Criar;
