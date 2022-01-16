const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const {dbConnection} = require('./database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:'/api/autentificacion',
            usuario:'/api/usuario',
            tienda:'/api/tienda',
            producto:'/api/productos',
            comentarios:'/api/comentarios'
        }

        this.conectarDB();

        this.middlewares();

        this.routes();

    }


    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        this.app.use(cors());

        this.app.use(express.json());

        this.app.use(express.static(path.resolve(__dirname,'public')));

    }

    routes(){
        this.app.use(this.paths.auth,require('./routes/autentificacion'));
        this.app.use(this.paths.usuario,require('./routes/usuarios'));
        this.app.use(this.paths.tienda,require('./routes/tiendas'));
        this.app.use(this.paths.comentarios,require('./routes/comentarios'));
        this.app.use(this.paths.producto,require('./routes/productos'));

    }

    listen(){

        this.app.listen(this.port,()=>{
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}

module.exports = Server;