import React, { useState } from 'react';
import {Text, TextInput, View, Button, StyleSheet, FlatList} from 'react-native';
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
function AreaDeCriacao({ tabuleiro }) {
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
      </View>
    </View>
  );
}

class Tabuleiro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabuleiros: [],
    };
  }

  carregarTabuleiros = async () => {
    try {
      const chaves = await AsyncStorage.getAllKeys();
      const dados = await AsyncStorage.multiGet(chaves);

      for (const [chave, valor] of dados) {
        try {
          const valorEmArray = JSON.parse(valor);
          if (!Array.isArray(valorEmArray)) {
            await AsyncStorage.removeItem(chave);
          }
        } catch {
          await AsyncStorage.removeItem(chave);
        }
    }
    
      const tabuleiros = dados.map(([chave, valor]) => ({
        nome: chave,
        tabuleiro: JSON.parse(valor),
      }));

      this.setState({ tabuleiros });
    } catch (erro) {
      console.error("Erro ao carregar tabuleiros:", erro);
    }
  };

  deletar = async (nomeDeletar) => {
  try {
    await AsyncStorage.removeItem(nomeDeletar);
    this.carregarTabuleiros();
  } catch (erro) {
    console.error("Erro ao deletar o tabuleiro:", erro);
  }
}

  componentDidMount() {
    this.carregarTabuleiros();
    this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
      this.carregarTabuleiros();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeFocus) {
      this.unsubscribeFocus();
    }
  }

  render() {
    const {tabuleiros} = this.state;
    return (
      <View style={styles.containerA}>
        <FlatList
          data={tabuleiros}
          keyExtractor={(item) => item.nome}
          renderItem={({ item }) => (
            <View style={styles.list}>
              <Text style={styles.text}>{item.nome}</Text>
              <AreaDeCriacao tabuleiro={item.tabuleiro} />
              <View style={styles.containerD}>
                <Button style={styles.btn} title="Jogar" 
                  onPress={()=>this.props.navigation.navigate("Jogo", { tabuleiro: item.tabuleiro })}>
                </Button>
                <Text style={styles.text}>{" "}</Text>
                <Button style={styles.btn} title="Excluir" 
                  onPress={()=>this.deletar(item.nome)}>
                </Button>
              </View>
            </View>
          )}
        />
        <Button title="Criar" onPress={()=>this.props.navigation.navigate("Criar")}></Button>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  containerA: {
    flex: 1,
  },
  list: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  containerD: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  canvas: {
    width: 290,
    height: 510,
    backgroundColor: 'gray',
  },
  text: {
    fontSize: 22,
    marginTop: 10,
  },
  btn: {
    padding: 10,
  },
});

export default Tabuleiro;
