import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './pages/login';
import Main from './pages/main';

export default function Routes() {
  return (
    <BrowserRouter>
      {/* 
        React entende a url pelo inicio dela, ou seja tendo a '/', 
        ele direciona para a primeira que encontrar com a '/',
        por isso é necessário usar o atributo 'exact' na url padrão, pelo menos
      */}
      <Route path="/" exact component={Login} />
      <Route path="/dev/:id" component={Main} />
    </BrowserRouter>
  );
}