const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const Tienda = require("../models/tiendas");
const { generarJWT } = require("../helpers/jwt");
const mongoose = require('mongoose');
const { generarNombre } = require("../helpers/generar_nombre");

const stripe = require('stripe')('sk_test_51IDv5qAJzmt2piZ3A5q7AeIGihRHapcnknl1a5FbjTcqkgVlQDHyRIE7Tlc4BDST6pEKnXlcomoyFVAjeIS2o7SB00OgsOaWqW');

const crearUsuario = async (req, res = response) => {

  const { correo, contrasena } = req.body;


  try {
    const existeEmail = await Usuario.findOne({correo: correo.toLowerCase()});

    if (existeEmail) {
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
    
    const customer = await stripe.customers.create({
      description: `Cliente creado con el ID : ${usuario._id}`,
      email:correo,
      name:req.body.nombre,
      phone:req.body.numero_celular
    });

    const salt = bcrypt.genSaltSync();

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
      total:0,
      tarjeta:'',
      efectivo:false,
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

    await usuario.save();


    const token = await generarJWT(usuario.id);

    var checkToken = await Tienda.findOne({punto_venta:req.body.tokenFB});


  if(checkToken){
    checkToken = true;
  }else{
    checkToken = false;
  }

    res.status(200).json({
      ok: true,
      usuario,
      token,
      checkToken
    });

  } catch (error) {
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
};

const iniciarUsuario = async (req, res = response) => {
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
        errores:[{
          value:"",
          msg:"La contraseña no coincide",
          param:"contrasena",
          location: "",

        }],
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
};


const renovarToken = async (req, res = response) => {


  const uid = req.uid;

  const token = await generarJWT(uid);

  const usuario = await Usuario.findById(uid);

  usuario.tokenFB = req.header('x-token-firebase');

  await usuario.save();

  const usuario2 = await Usuario.aggregate(
    [
      {$match:{_id:mongoose.Types.ObjectId(uid)}},
      {$unwind:'$negocios'},
      {
        $lookup:{
            from: 'tiendas',
            localField: 'negocios',
            foreignField: '_id',
            as:'negocioPro'
        },
      },
    ]
  )

  usuario.negocios = listado;


  var listado = [];

  for (let index = 0; index < usuario2.length; index++) {
    var actual = usuario2[index];
    
    var element = {};

    element.nombre = actual.negocioPro[0].nombre;
    element.imagen = actual.negocioPro[0].imagen_perfil;
    element.uid = actual.negocioPro[0]._id;


    listado.push(element);
    
  }


  usuario.negocios = listado;
    
  const token2 = req.header('x-token-firebase');


  var checkToken = await Tienda.findOne({punto_venta:token2});


  if(checkToken){
    checkToken = true;
  }else{
    checkToken = false;
  }


  res.json({
    ok: true,
    usuario: usuario,
    token,
    checkToken
  });
  
};

const iniciarUsuarioTelefono = async(req,res= response) =>{



  const {numero,tokenFB} = req.body;


  const usuarioDB = await Usuario.findOne({numero_celular:numero});


  if(!usuarioDB){

    return res.status(404).json({ok:false});
    
  }else{
    
    usuarioDB.tokenFB = tokenFB;

    await usuarioDB.save();
  
    const usuario2 = await Usuario.aggregate(
      [
        {$match:{_id:mongoose.Types.ObjectId(usuarioDB._id)}},
        {$unwind:'$negocios'},
        {
          $lookup:{
              from: 'tiendas',
              localField: 'negocios',
              foreignField: '_id',
              as:'negocioPro'
          },
        },
      ]
    )
  
    var listado = [];
  
    for (let index = 0; index < usuario2.length; index++) {
      var actual = usuario2[index];
      
      var element = {};
  
      element.nombre = actual.negocioPro[0].nombre;
      element.imagen = actual.negocioPro[0].imagen_perfil;
      element.uid = actual.negocioPro[0]._id;
  
  
      listado.push(element);
      
    }
  
    usuarioDB.negocios = listado;

    const token = await generarJWT(usuarioDB.id);

    var checkToken = await Tienda.findOne({punto_venta:req.body.tokenFB});


  if(checkToken){
    checkToken = true;
  }else{
    checkToken = false;
  }

    res.status(200).json({
      ok: true,
      usuario: usuarioDB,
      token,
      checkToken
    });

  }

}
module.exports = {
  crearUsuario,
  iniciarUsuario,
  renovarToken,
  iniciarUsuarioTelefono
};
