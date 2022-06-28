const { response } = require("express");
const Notificacion = require('../notificaciones');

const ListaProductos = require('../models/lista_productos');
const Producto = require('../models/producto');

const test= async(req,res = response) =>{
    const data = {
        tokenId:'cbuRKMi9Ru2k4oGgH16WT2:APA91bFiEbQ9ZWpfPK2RxYOnALOpqKXQ2_RJtAszm2-IdyjCkkn3OpEap8dUwLEESDpSe9MfEUKp5gUG3im8cpyvHHv4V787WeRA9eRlw0EWaooPgm_DaDo_nlM2c29g7WZ4bQNRr8Ci',
        titulo:'Enviado desde NodeJS',
        mensaje:'Si puede perros 7u7',
    };

    Notificacion.sendPushToOneUser(data);

    return res.status(200).json({ok:true});

}
const add = async(req,res)=>{

    const nuevoProducto = new Producto(req.body);

    await ListaProductos.findOneAndUpdate({_id:'62b759abb404a358d356d6a1'},{$push:{'productos':nuevoProducto}});

    return res.status(200).json({ok:true,producto:nuevoProducto});
    
    
}

module.exports = {
    test,add
}