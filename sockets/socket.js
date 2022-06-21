const { io } = require('../app');
const { comprobarJWT } = require('../helpers/jwt');
const {usuarioConectado, usuarioDesconectado} = require('../controllers/socket');


// Mensajes de Sockets
io.on('connection', client => {

    console.log('Cliente conectado');

    const [valido,uid] = comprobarJWT(client.handshake.auth['x-token']);

    if(!valido){

        console.log('Cliente desconectado no autorizado');

        return client.disconnect();
    }

    console.log('Cliente autorizado');

    usuarioConectado(uid);

    client.join(uid);

    client.on('disconnect', () => {
        usuarioDesconectado(uid);
        console.log('Cliente desconectado');
    });

    client.on('mensaje-personal', ( payload ) => {
        console.log('Mensaje', payload);

        /*io.to(payload.para).emit('mensaje-personal',payload);*/

    });


});
