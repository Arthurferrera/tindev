import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAvoidingView, Platform, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

import api from '../services/api';

import logo  from '../assets/logo.png';

export default function Login({ navigation }) {
  const [dev, setDev] = userState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then(dev => {
      if(dev) {
        navigation.navigate('Main', { dev });
      }
    })
  }, []);

  async function handleLogin(){
    // chamando a api, metodo que cadastra/faz login do usuário
    const response = await api.post('/devs', { username: dev });
    // pegando o id do retorno da requisição
    const { _id } = response.data;

    await AsyncStorage.setItem('dev', _id)
    
    // navegando para a outra página, passando o _id como parâmetro
    navigation.navigate('Main', { user: _id });
  }
  
  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={Platform.OS ==='ios' }
      style={styles.container}
    >

      <Image source={logo} />

      <TextInput 
      // serve para as palavras não ficar com a primeira letra MAIUSCULA
        autoCapitalize="none"
        // serve para ativar ou inativar o auto corretor
        autoCorrect={false}
        placeholder="Digite seu usuário do GitHub"
        placeholderTextColor="#999"
        style={styles.inpu}
        value={dev}
        onChangeText={setDev}
      />

      <TouchableOpacity 
      onPress={handleLogin}
      style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },

  input: {
    height: 45,
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15
  },

  button: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#DF4723',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 16
  },
});