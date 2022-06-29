const Usuario = require("../models/usuario");
const Tienda = require("../models/tiendas");
const Mensaje = require("../models/mensaje");
const bcrypt = require('bcryptjs');

const usuarioConectado = async (uid = "") => {
  const usuario = await Usuario.findById(uid);
  usuario.online = true;
  await usuario.save();
  return usuario;
};

const conectarNegocio = async (token="")=>{
  const tienda = await Tienda.findOne({punto_venta:token});
  tienda.online = true;
  await tienda.save();
  return tienda;
}

const desconectarNegocio = async (token="")=>{
  const tienda = await Tienda.findOne({punto_venta:token});
  if(tienda){
    tienda.online = false;
    await tienda.save();
  }
  return tienda;
}

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
    const existeEmail = await Usuario.findOne({ email:payload.email });

    if (existeEmail) {
        return false;
    }

    const usuario = new Usuario(payload);

    
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(payload.password, salt);
    usuario.admin = false;
    

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
  findUser,
  desconectarNegocio,
  conectarNegocio
};
