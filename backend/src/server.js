const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors')

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};



io.on('connection', socket => {

  const { user } = socket.handshake.query;

   connectedUsers[user] = socket.id;

  // connectedUsers[ID_USUARIO] = socket.id;
  
  
  
  
  
  
  
  
  // ************ EXEMPLO **************
  // escutando um evento disparado pelo front end, definindo o tipo de requisição e a arrow function trabalha o que foi recebido (objeto, string...)
  // socket.on('hello', message => {
  //   console.log(message);
  // })

  // // disparando um evento que envia informações para o front end, definindo o tipo/nome da requisição e o dado que será enviado (objeto, string...)
  // setTimeout(() => {
  //   socket.emit('world', {
  //     message: 'OmniStack'
  //   })
  // }, 5000)
  
});


mongoose.connect('mongodb+srv://react:react@cluster0-6khyq.mongodb.net/tindev?retryWrites=true&w=majority', {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);