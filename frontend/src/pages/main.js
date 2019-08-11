import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './main.css';

import api from '../services/api';

import logo from '../assets/logo.svg';
import deslike from '../assets/deslike.svg';
import like from '../assets/like.svg';

// macth - possui todos os parametros passados na url
export default function Main({ match }) {
  // useState é usado para que o componente consiga enxergar e manipular o estado de uma variavel
  /* sempre que for necessário alterar o valor da variavel, mesmo sendo um array, é necessário fazer
   isso através do 'método' set */
  const [devs, setDevs] = useState([]);

  // parametros do useEffect
  // 1 - a função que está sendo chamada (pode ser uma arrow function)
  // 2 - e quando ela vai ser executada (no caso de um array vazio, ela vai ser executada apenas 1 vez no código)
  useEffect(() => {
    async function loadUsers() {
      // chamada ao método da api que lista os devs
      const response = await api.get('/devs', {
        headers: {
          user: match.params.id,
        }
      })
      setDevs(response.data);
      
    }

    loadUsers();
  }, [match.params.id]);

  async function handleLike(id) {
    // no método post, para enviar os headers, sempre será o 3° parâmetro
    // o segundo parâmetro é o corpo da requisição
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id },
    })

    setDevs(devs.filter(dev => dev._id !== id));
    
  }

  async function handleDeslike(id) {
    // no método post, para enviar os headers, sempre será o 3° parâmetro
    // o segundo parâmetro é o corpo da requisição
    await api.post(`/devs/${id}/deslikes`, null, {
      headers: { user: match.params.id },
    })

    setDevs(devs.filter(dev => dev._id !== id));
    
  }
  

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>
      { devs.length > 0 ? (
        <ul>
          {devs.map(dev => (
            // sempre dentro de uma função map, é necessário usar a key para identificação e performance 
            <li key={dev._id}>
              <img src={dev.avatar} alt={dev.name} />
              <footer>
                <strong>{dev.name}</strong>
                <p>{dev.bio}</p>
              </footer>
  
              <div className="buttons">
                  {/* 
                    No onclick, usar arrow function, para que a função não seja executada
                    assim que a tela renderuzar (apenas quando tiver que passar parametro 
                    para a função) 
                  */}
                  <button type="button" onClick={() => handleDeslike(dev._id)}>
                    <img src={deslike} alt="Não curtir" />
                  </button>
                  <button type="button" onClick={() => handleLike(dev._id)}>
                    <img src={like} alt="Curtir" />
                  </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          Acabou ;(
        </div>
      ) }

    </div>
  );
}