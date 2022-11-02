const {dbConnection} = require('./database/config');
const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();


class Server {

    constructor(){
        
        this.server = require('http').createServer(this.app);
        this.port = process.env.PORT;
        this.app = express();

        module.exports.io = require('socket.io')(this.server);
        require('./sockets/socket');

        this.paths = {

            direcciones:'/api/direcciones',
            comentarios:'/api/comentarios',
            repartidor:'/api/repartidor',
            auth:'/api/autentificacion',
            producto:'/api/productos',
            usuario:'/api/usuario',
            tienda:'/api/tiendas',
            stripe:'/api/stripe',
            twilio:'/api/twilio',
            google:'/api/google',
            test:'/api/test'

        }

        this.middlewares();
        this.conectarDB();
        this.routes();

    }


    async conectarDB(){

        await dbConnection();

    }

    middlewares(){

        this.app.use(express.static(path.resolve(__dirname,'public')));
        this.app.use(express.json());
        this.app.use(cors());

    }

    routes(){

        this.app.use(this.paths.direcciones,require('./routes/direcciones'));
        this.app.use(this.paths.comentarios,require('./routes/comentarios'));
        this.app.use(this.paths.repartidor, require('./routes/repartidor'));
        this.app.use(this.paths.auth,       require('./routes/autentificacion'));
        this.app.use(this.paths.producto,   require('./routes/productos'));
        this.app.use(this.paths.usuario,    require('./routes/usuarios'));
        this.app.use(this.paths.tienda,     require('./routes/tiendas'));
        this.app.use(this.paths.stripe,     require('./routes/stripe'));
        this.app.use(this.paths.twilio,     require('./routes/twilio'));
        this.app.use(this.paths.google,     require('./routes/google'));
        this.app.use(this.paths.test,       require('./routes/test'));

    }

    listen(){

        this.server.listen(this.port,()=>{

            console.log('Servidor corriendo en puerto', this.port );

        });
        
    }

}

module.exports = Server;