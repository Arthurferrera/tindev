import React, { useState } from 'react';
import './login.css';

import api from '../services/api';

import logo from '../assets/logo.svg';


export default function Login({ history }) {

  // criando o estado de um componente/variável
  const [username, serUsername] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    // quando o valor e o nome do parametro são iguais, pode se declarar apenas uma vez
    const response = await api.post('/devs', {
      username,
    });

    const { _id } = response.data;

    // fazendo a navegação para a página desejada
    history.push(`/dev/${_id}`);
  }

  return (
    // no react é recomendado usar o className ao invés do class
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Tindev"/>
        <input
          placeholder="Digite seu usuário do GitHub"
          value={username}
          onChange={e => serUsername(e.target.value)} //setando o valor para o a variavel username, quando o campo alterar o valor
          name="user"
          id="user"
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}