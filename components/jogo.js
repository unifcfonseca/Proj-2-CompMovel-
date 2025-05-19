import React from 'react';
import { View, StyleSheet, Text, TextInput, Button } from 'react-native';
import { Canvas, Circle, Rect, Group, Skia, Path, useTouchHandler, useValue} from '@shopify/react-native-skia';
import { Accelerometer } from 'expo-sensors';

//Objeto da base do jogo, grade 5 por 9
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

      <Rect x={60}  y={10} width={5} height={490} color="#e0e0e0" />
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
    <Group transform={[{ translateX: x+25 }, { translateY: y+25 }]}>
      <Circle cx={0} cy={0} r={22} color="darkgray" />
      <Circle cx={0} cy={1} r={18} color="gray" />
       <Path path={desviar} color="red" strokeWidth={3} style="stroke"/>
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
    <Group transform={[{ translateX: x+25 }, { translateY: y+25 }]}>
      <Circle cx={0} cy={0} r={22} color="darkgray" />
      <Circle cx={0} cy={1} r={18} color="gray" />
       <Path path={bandeira} color="red"/>
    </Group>
  );
}

function AreaDeCriacao({setJogador, tabuleiro }) {
  return (
    <Group>
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
            return null;
          default:
            return null;
        }
      })}
    </Group>
  );
}

class Jogo extends React.Component {
  constructor(props){
    super(props);
    console.log("params:", this.props.route.params);
    this.vitorias = [];
    this.derrotas = [];
    this.paredes = [];
    this.state = {
      vx: 150,
      vy: 150,
      x: 0,
      y: 0,
      tabuleiro: this.props.route.params.tabuleiro,
      acabou: false,
      jogadorNaTela: "red",
    };
  }

  colisao = (xP, yP) => {
  const raioPlayer = 20;
  const tamParede = 50;
  const raioBuraco = 5;

  for (let index = 0; index < this.state.tabuleiro.length; index++) {
    const qual = this.state.tabuleiro[index];
    const x = 10 + (index % 5) * 55;
    const y = 10 + Math.floor(index / 5) * 55;

    switch (qual) {
      case 1: {
        const checkPx = xP + raioPlayer > x && xP - raioPlayer < x + tamParede;
        const checkPy = yP + raioPlayer > y && yP - raioPlayer < y + tamParede;
        if (checkPx && checkPy) return [1, true];
        break;
      }
      case 2: {
        const checkBx = xP + raioPlayer > x + 25 - raioBuraco && xP - raioPlayer < x + 25 + raioBuraco;
        const checkBy = yP + raioPlayer > y + 25 - raioBuraco && yP - raioPlayer < y + 25 + raioBuraco;
        if (checkBx && checkBy) return [2, true];
        break;
      }
      case 3: {
        const checkVx = xP + raioPlayer > x + 25 - raioBuraco && xP - raioPlayer < x + 25 + raioBuraco;
        const checkVy = yP + raioPlayer > y + 25 - raioBuraco && yP - raioPlayer < y + 25 + raioBuraco;
        if (checkVx && checkVy) return [3, true];
        break;
      }
    }
  }
  return [0, false];
};

  setJogador = (x, y) => {
    this.setState({ vx: x, vy: y });
  };

  componentDidMount() {
    const indexJogador = this.state.tabuleiro.findIndex(e => e === 4);
    if (indexJogador !== -1) {
      const x = 10 + (indexJogador % 5) * 55 + 25;
      const y = 10 + Math.floor(indexJogador / 5) * 55 + 25;
      this.setState({ vx: x, vy: y });
    }
    Accelerometer.setUpdateInterval(70);

    this.subscription = Accelerometer.addListener((data) => {
      this.setState((prevState) => {
        const xP = Math.max(30, Math.min(260, prevState.vx - data.x * 20));
        const yP = Math.max(30, Math.min(480, prevState.vy + data.y * 20));

    const checkColisao = this.colisao(xP, yP);
    switch (checkColisao[0]) {
        case 1:
          if (checkColisao[1]) {
            return { x: data.x, y: data.y };
          } else {
            return { x: data.x, y: data.y, vx: xP, vy: yP }; 
          }
        case 2:
          if (checkColisao[1] && !this.state.acabou) {
            this.setState({ acabou: true, jogadorNaTela:"transparent" });
            alert("Você perdeu!");
          }
          return { x: data.x, y: data.y, vx: xP, vy: yP }; 
          
        case 3:
          if (checkColisao[1] && !this.state.acabou) {
            this.setState({ acabou: true, jogadorNaTela:"transparent"});
            alert("Você ganhou!");
          }
          return { x: data.x, y: data.y, vx: xP, vy: yP }; 
        default:
          return { x: data.x, y: data.y, vx: xP, vy: yP };
      }
    

  });
});
  }

  componentWillUnmount() {
    this.subscription?.remove();
  }

  render() {
    const { x, y, vx, vy } = this.state;

    return (
      <View style={styles.container}> 
      <View style={styles.containerB}>
        <View style={styles.containerC}>
          <Canvas style={styles.canvas}>
            <AreaDeCriacao setJogador={this.setJogador} tabuleiro={this.state.tabuleiro}/>
            <Circle cx={vx} cy={vy} r={20} color={this.state.jogadorNaTela} />
          </Canvas>
        </View>
      </View>
        <Button
          title="Voltar"
          onPress={() => this.props.navigation.goBack()}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    width: 290,
    height: 510,
    backgroundColor: 'gray',
  },
});

export default Jogo;