const Usuario = require("../models/usuario");
const Mensaje = require("../models/mensaje");
const bcrypt = require('bcryptjs');

const usuarioConectado = async (uid = "") => {
  const usuario = await Usuario.findById(uid);
  usuario.online = true;
  await usuario.save();
  return usuario;
};
const usuarioDesconectado = async (uid = "") => {
  const usuario = await Usuario.findById(uid);
  usuario.online = false;
  await usuario.save();
  return usuario;
};

const grabarMensaje = async (payload) => {
  try {
    const mensaje = new Mensaje(payload);
    await mensaje.save;
    return true;
  } catch (e) {
    return false;
  }
};

const findUser = async (payload) => {
  try {
    const user = await Usuario.findById(payload);
    return user.store;
  } catch (error) {
    return false;
  }
};

const agregarUsuario = async (payload) => {
  try {
      console.log('si entro');
    const existeEmail = await Usuario.findOne({ email:payload.email });

    if (existeEmail) {
        console.log('existe');
        return false;
    }
    console.log('no existe');

    const usuario = new Usuario(payload);

    console.log(usuario);
    
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(payload.password, salt);
    usuario.admin = false;
    
    console.log(usuario);

    await usuario.save();

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  usuarioConectado,
  usuarioDesconectado,
  grabarMensaje,
  agregarUsuario,
  findUser
};
