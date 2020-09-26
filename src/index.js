const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');

const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

// Conexión BBDD:
mongoose.connect('mongodb://localhost/chat-database') // Conecta a la BBDD
    .then(db => console.log('db is connected')) // Cuando conecta a BD muestra mensaje por consola
    .catch(err => console.log(err)); // En caso contrario, muestra error

// Settings
app.set('port', process.env.PORT || 3000); // Toma el puerto si el servidor lo proporciona y si no toma el puerto 3000

require('./sockets')(io);

// Enviando archivos estáticos:
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server:
server.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});