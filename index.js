const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

//DB Config
const {dbConnection} = require('./database/config').dbConnection();

// App de Express
const app = express();

app.use(cors());

//Lectura
app.use(express.json());

// Node Server io
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');

// Path público
const publicPath = path.resolve( __dirname, 'public' );
app.use( express.static( publicPath ) );

app.use('/api/login',require('./routes/auth'));
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/direcciones',require('./routes/direcciones'));
app.use('/api/tiendas',require('./routes/tiendas'));
app.use('/api/productos',require('./routes/productos'));
app.use('/api/puntoventa',require('./routes/productos_fake'));
app.use('/api/stripe',require('./routes/stripe'));

server.listen( process.env.PORT, ( err ) => {

    if ( err ) throw new Error(err);

    console.log('Servidor corriendo en puerto', process.env.PORT );

});
