const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { generarNombre } = require("../helpers/generar_nombre");

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

    console.log(usuario);

    const salt = bcrypt.genSaltSync();

    usuario.contrasena = bcrypt.hashSync(contrasena, salt);
    usuario.correo = req.body.correo.toLowerCase();
    usuario.nombre_usuario = generarNombre(usuario.nombre);
    usuario.socio = false;
    usuario.online = false;


    await usuario.save();


    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
    });

  } catch (error) {
    console.log(error);
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
    console.log('esta mal'+error);
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

  res.json({
    ok: true,
    usuario,
    token,
  });
};

const iniciarUsuarioTelefono = async(req,res= response) =>{
  const {numero} = req.body;
  const usuarioDB = await Usuario.findOne({numero_celular:numero});
  if(!usuarioDB){

    return res.status(404).json({ok:false});
    
  }else{
    
    const token = await generarJWT(usuarioDB.id);

    res.status(200).json({
      ok: true,
      usuario: usuarioDB,
      token,
    });

  }

}
module.exports = {
  crearUsuario,
  iniciarUsuario,
  renovarToken,
  iniciarUsuarioTelefono
};
