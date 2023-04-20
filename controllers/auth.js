const stripe = require('stripe')('sk_test_51IDv5qAJzmt2piZ3A5q7AeIGihRHapcnknl1a5FbjTcqkgVlQDHyRIE7Tlc4BDST6pEKnXlcomoyFVAjeIS2o7SB00OgsOaWqW');
const { generarNombre } = require("../helpers/generar_nombre");
const { generarJWT } = require("../helpers/jwt");
const Usuario = require("../models/usuario");
const Estado = require("../models/estado");
const Tienda = require("../models/tiendas");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');

var controller = {

  crearUsuario:async(req,res)=>{

    const { correo, contrasena } = req.body;
  
    try {
      const existeEmail = await Usuario.findOne({correo: correo.toLowerCase()});
  
      if (existeEmail) {
        console.log('correo repetido');
  
        res.status(400).json({
          ok: false,
          errores: {
            value: correo,
            msg: "Este correo ya se encuentra registrado",
            param: "correo",
            location: "session",
          },
        });
      }
      
      const usuario = new Usuario(req.body);
  
      const numero = req.body.numero_celular.replace(/ /g,'');
      
      const customer = await stripe.customers.create({
        description: `Cliente creado con el ID : ${usuario._id}`,
        email:correo,
        name:req.body.nombre,
        phone:numero
      });
  
      const salt = bcrypt.genSaltSync();
  
      const str = req.body.nombre.toLowerCase();
  
      const arr = str.split(" ");
  
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    
      }
  
      const str2 = arr.join(" ");
  
      usuario.nombre = str2;
  
      usuario.contrasena = bcrypt.hashSync(contrasena, salt);
      usuario.correo = req.body.correo.toLowerCase();
      usuario.nombre_usuario = generarNombre(usuario.nombre);
      usuario.socio = false;
      usuario.online = false;
      usuario.envio_promo = false;
      usuario.customer_id = customer.id;
      usuario.tokenFB = req.body.tokenFB;
      usuario.cesta ={
        productos:[],
        apartado:false,
        total:0,
        tarjeta:'',
        efectivo:true,
        direccion:{
          titulo:'',
          coordenadas:{
            lat:21.354396,
            lng:-101.9467424
          },
          predeterminado:false,
          _id:''
        },
        codigo:''
      }
  
  
      usuario.negocios = [];
      usuario.repartidor = false;
      usuario.ultima_tarea = new Date();
      usuario.online_repartidor = false;
      usuario.transito = false;
  
      await usuario.save();
  
  
      const token = await generarJWT(usuario.id);
  
      var checkToken = await Tienda.findOne({punto_venta:req.body.tokenFB});
  
  
    if(checkToken){
      checkToken = true;
    }else{
      checkToken = false;
    }
  
    console.log('todo cool');
  
      res.status(200).json({
        ok: true,
        usuario,
        token,
        checkToken
      });
  
    } catch (error) {
      console.log('valio verga'+error);
      res.status(500).json({
        ok: false,
        error,
        errors: {
          session: {
            value: null,
            msg: "Internal server error",
            param: "sesion",
            location: "body",
          },
        },
      });
    }

  },
  iniciarUsuario : async(req,res)=>{

    const { correo, contrasena } = req.body;
    
    try {
      
      const usuarioDB = await Usuario.findOne({ correo });
    
      if (!usuarioDB) {

        return res.status(404).json({
          ok: false,
          errores:[{
            value:"",
            msg:"Email no encontrado",
            param:"correo",
            location: "",
          }],
        });
    
      }

      const validarPassword = bcrypt.compareSync(contrasena, usuarioDB.contrasena);
      
      if (!validarPassword) {

        return res.status(404).json({
          ok: false,
          errores:[
            {
            value:"",
            msg:"La contraseña no coincide",
            param:"contrasena",
            location: "",
            }
          ],
        });
        
      }

      const token = await generarJWT(usuarioDB.id);

      res.status(200).json({
        ok: true,
        usuario: usuarioDB,
        token,
      });

    } catch (error) {
    
      res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
      });

    }

  },
  renovarToken : async (req,res)=>{

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    usuario.tokenFB = req.header('x-token-firebase');

    await usuario.save();

    Usuario.find({_id:mongoose.Types.ObjectId(uid)}).
    populate('negocios').exec(async function(err,data)  {

      const token2 = req.header('x-token-firebase');

      var checkToken = await Tienda.findOne({punto_venta:token2});

      if(checkToken){

        checkToken = true;

      }else{
      
        checkToken = false;

      }

      res.json({
        ok: true,
        usuario: data[0],
        token:token,
        checkToken
      });

    });

  },
  iniciarUsuarioTelefono: async(req,res)=>{

  const {tokenFB} = req.body;

  const numero = req.body.numero.replace(/ /g,'');

  Usuario.find({numero_celular:numero}).
    populate('negocios').exec(async function(err,data)  {

      if(!data || data.length == 0){

        return res.status(404).json({ok:false});
        
      }else{

        const usuario = await Usuario.findOne({numero_celular:numero});

        if(usuario){
        
        usuario['tokenFB'] = tokenFB;
    
        await usuario.save();
      
        }
      
        const token = await generarJWT(data[0]._id);

        var checkToken = await Tienda.findOne({punto_venta:req.body.tokenFB});
    
        if(checkToken){
 
          checkToken = true;
 
        }else{
 
          checkToken = false;
 
        }
    
        res.status(200).json({
          ok: true,
          usuario: data[0],
          token,
          checkToken
        });
    
      }

    });

  },
  revisarEstado: async(req,res)=>{

    const version = req.header('x-version');

    console.log(version);

    if(version){

      const estado = await Estado.findOne({'_id':'644031c2199bafb28ba36532'});

      if(version== estado.version){

        estado.version = true;

        console.log(estado);

        return res.status(200).json(estado);
        
      }else{
        
        estado.version = false;
        
        return res.status(200).json(estado);
      
      }
  
    }else{

      const estado = await Estado.findOne({'_id':'644031c2199bafb28ba36532'});

      estado.version = false;
      
      return res.status(200).json(estado);

    }

  }
  
}

module.exports = controller