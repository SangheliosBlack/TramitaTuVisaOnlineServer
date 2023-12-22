const {dbConnection} = require('./database/config');
const swaggerOptions = require('./utils/swagger_config');
const corsOptions = require('./utils/cors_config');
const compression = require('compression');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path');

const expressWinston = require('express-winston')
const helmet = require('helmet');
const xss = require('xss-clean')
const trim_json_values = require('./utils/trim_json_values');

const logger = require('./helpers/logger');

require('dotenv').config();


class Server {

    constructor(){
        
        this.app = express();
        this.server = require('http').createServer(this.app);
        this.port = process.env.PORT || 3000;
        this.env = process.env.NODE_ENV || 'development'
        this.apiVersion = `/api/${process.env.API_VERSION || 'v1'}`;

        module.exports.io = require('socket.io')(this.server);
        require('./sockets/socket');

        this.paths = {

            auth:'/api/autentificacion',
            usuario:'/api/usuario',
            stripe:'/api/stripe',
            twilio:'/api/twilio',
            google:'/api/google',
            test:'/api/test',
        }

        this.middlewares();
        this.conectarDB();
        this.routes();

    }


    async conectarDB(){

        await dbConnection();

    }

    middlewares(){

      this.setupLogger();
      this.setupSecurity();
      this.setupCors();

      const expressSwagger = require('express-swagger-generator')(this.app);
      expressSwagger(swaggerOptions.options);

      this.app.use(express.static(path.resolve(__dirname,'public')));
      this.app.use(bodyParser.json(),trim_json_values);
      this.app.use(compression());

      this.app.use(this.env !== 'production' ? morgan('dev') : null);

      this.app.use(
        bodyParser.urlencoded({
          limit: '50mb',
          extended: true,
        })
      );

      this.app.use((req, res, next) => {
        req.requestTime = new Date().toISOString();
        next();
      });

    }

    routes(){

      this.app.use(`${this.apiVersion}${this.paths.auth}`,       require('./routes/autentificacion'));
      this.app.use(`${this.apiVersion}${this.paths.usuario}`,    require('./routes/usuarios'));
      this.app.use(`${this.apiVersion}${this.paths.stripe}`,     require('./routes/stripe'));
      this.app.use(`${this.apiVersion}${this.paths.twilio}`,     require('./routes/twilio'));
      this.app.use(`${this.apiVersion}${this.paths.google}`,     require('./routes/google'));
      this.app.use(`${this.apiVersion}${this.paths.test}`,       require('./routes/test'));

      this.app.all('*', (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
      });

      this.app.use((err, req, res, next) => {
        logger.error(err);

        res.status(err.status || 500).json({
          error: {
            message: err.message || 'Internal Server Error',
          },
        });
      });

    }

    listen(){

        this.server.listen(this.port,()=>{

          logger.info(`Servidor corriendo en puerto ${this,this.port}`);

        });
        
    }

    setupLogger() {
      this.app.use(
        expressWinston.logger({
          winstonInstance: logger,
          msg: function (req, res) {
            return `${res.statusCode} - ${req.method} - ${req.url} - ${
              res.responseTime
            }ms from: ${req.protocol}://${req.get('host')}`;
          },
        })
      );
    }

    setupSecurity() {
      this.app.use(helmet());
      this.app.use(xss());
    }
    
    setupCors() {
      this.app.use(cors(corsOptions.config));
    }

}

module.exports = Server                     ;