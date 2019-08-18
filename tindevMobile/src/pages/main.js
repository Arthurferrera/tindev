import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, Image, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

import logo  from '../assets/logo.png';

import api from '../services/api';
import { useScreens } from 'react-native-screens';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';


export default function Main({ navigation }) {
  const id = navigation.getParams('user');
  // useState é usado para que o componente consiga enxergar e manipular o estado de uma variavel
  /* sempre que for necessário alterar o valor da variavel, mesmo sendo um array, é necessário fazer
     isso através do 'método' set */
  const [devs, setDevs] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  // parametros do useEffect
  // 1 - a função que está sendo chamada (pode ser uma arrow function)
  // 2 - e quando ela vai ser executada (no caso de um array vazio, ela vai ser executada apenas 1 vez no código)
  useEffect(() => {
    async function loadUsers() {
      // chamada ao método da api que lista os devs
      const response = await api.get('/devs', {
        headers: {
          user: id,
        }
      })
      setDevs(response.data);
      
    }
 
    loadUsers();
  }, [id]);

  
  useEffect(() => {
    const socket = io('http://192.168.1.34:3333', {
      // query são parâmetros adicionais que podemos enviar na conexão
      query: { user: id }
    });

    socket.on('match', dev => {
      setMatchDev(dev);
      
    });  
  }, [id]);
 
  async function handleLike() {
    // dessa forma estou armazenando o primeiro objeto do array em uma variavel e o restante do array em outra 
    const [dev, ...rest] = devs;
    // no método post, para enviar os headers, sempre será o 3° parâmetro
    // o segundo parâmetro é o corpo da requisição
    await api.post(`/devs/${dev._id}/likes`, null, {
      headers: { user: id },
    })
 
    setDevs(rest);
     
  }

  async function handleDeslike() {
    // dessa forma estou armazenando o primeiro objeto do array em uma variavel e o restante do array em outra 
    const [dev, ...rest] = devs;
    // no método post, para enviar os headers, sempre será o 3° parâmetro
    // o segundo parâmetro é o corpo da requisição
    await api.post(`/devs/${dev._id}/deslikes`, null, {
      headers: { user: id },
    })
    
    setDevs(rest);
    
  }

  async function handleLogout() {
    await AsyncStorage.clear();

    navigation.navigate('Login');
  }
  
  return (
    // Esse elemento evita que o teclado do celular fique por cima de elementos da tela 
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo}/>
      </TouchableOpacity>

      <View style={styles.cardsContainer}>
        { useScreens.length === 0 ? <Text style={styles.empty}> Acabou :( </Text> : (
            devs.map((dev, index) => {
              <View key={dev._id} style={[styles.card, {zIndex: devs.length - index }]}>
                <Image style={styles.avatar} source={{ uri: dev.avatar }} />
                <View style={styles.footer}>
                  <Text style={styles.nome}> { dev.name } </Text>
                  <Text style={styles.bio} numberOfLines={3}> { dev.bio } </Text>
                </View>
              </View>
            })
          )
        }
      </View>


      { devs.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDeslike}>
            <Image source={dislike}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Image source={like}/>
          </TouchableOpacity>
        </View>
      ) }

      {
        matchDev && (
          <View stylle={styles.matchContainer}>
            <Image style={styles.matchImage} source={itsamatch}/>
            <Image style={styles.avatarMatch} source={{ uri: matchDev.avatar }}/>

            <Text style={styles.matchName}>
              {matchDev.name}
            </Text>
            <Text style={styles.matchBio}>
              {matchDev.bio}
            </Text>

            <TouchableOpacity onPress={() => setMatchDev(null)}>
              <Text style={styles.closeMatch}>
                FECHAR
              </Text>
            </TouchableOpacity>
          </View>
        )
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginTop: 30,
  },
  
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold'
  },

  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,    
  },

  card: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  avatar: {
    flex: 1,
    height: 300,
  },

  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  matchImage: {
    height: 60,
    resizeMode: 'contain'
  },

  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: '#FFF',
    marginVertical: 30,
  },

  matchName: {
    fontSize: 26,
    fontWeight: 900,
    color: '#FFF',
  },

  matchBio: {
    marginTop: 10,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 30,
  },

  closeMatch: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 900,
  },
}); 
