const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const server = express();

mongoose.connect('mongodb+srv://react:react@cluster0-6khyq.mongodb.net/tindev?retryWrites=true&w=majority', {
  useNewUrlParser: true
});

server.use(express.json());
server.use(routes);

server.listen(3333);