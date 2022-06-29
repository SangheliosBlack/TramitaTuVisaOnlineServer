const { io } = require('../app');
const { comprobarJWT } = require('../helpers/jwt');
const {usuarioConectado, usuarioDesconectado,conectarNegocio, desconectarNegocio} = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', client => {

    console.log('Cliente conectado');

    const [valido,uid] = comprobarJWT(client.handshake.headers['x-token']);

    if(!valido){

        console.log('Cliente desconectado no autorizado');

        return client.disconnect();
    }

    console.log('Cliente autorizado');

    usuarioConectado(uid);

    client.join(uid);

    client.on('disconnect', () => {
        usuarioDesconectado(uid);
        desconectarNegocio(client.handshake.headers['token']);
        console.log('Cliente desconectado');
    });

    client.on('desconectar-negocio', ( payload ) => {

        console.log('desconectando negocio');
        
        desconectarNegocio(client.handshake.headers['token']);

        client.broadcast.emit('estado-negocio', {'token':client.handshake.headers['token'],'estado':false});

        /*io.to(payload.para).emit('mensaje-personal',payload);*/

    });

    client.on('conectar-negocio', ( payload ) => {

        console.log('conectando negocio');
        
        conectarNegocio(payload.token);

        client.broadcast.emit('estado-negocio', {'token':client.handshake.headers['token'],'estado':true});

        // broadcast cuando es para todos menos quien lo envia

    });

});
