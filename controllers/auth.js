const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email: email.toLowerCase() });

    if (existeEmail) {
      res.status(400).json({
        ok: false,
        errores: {
          value: email,
          msg: "Este correo ya se encuentra registrado",
          param: "email",
          location: "session",
        },
      });
    }

    const usuario = new Usuario(req.body);

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    usuario.email.toLowerCase();
    usuario.admin = true;

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

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        errores:[{
          value:"",
          msg:"Email no encontrado",
          param:"email",
          location: "",

        }],
      });
    }

    const validarPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validarPassword) {
      return res.status(404).json({
        ok: false,
        errores:[{
          value:"",
          msg:"La contraseña no coincide",
          param:"password",
          location: "",

        }],
      });
    }

    const token = await generarJWT(usuarioDB.id);
    console.log('esta bien'+usuarioDB+token);

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


const renewToken = async (req, res = response) => {
  const uid = req.uid;

  const token = await generarJWT(uid);

  const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    usuario,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  renewToken,
  };
