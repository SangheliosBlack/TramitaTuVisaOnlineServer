const Producto = require('../models/producto');
const Tiendas = require('../models/tiendas');
const ListaProductos = require('../models/lista_productos');
const { response } = require('express');
const mongoose = require('mongoose');

const nuevoProducto = async (req,res = response)=>{

    console.log(req.body);

    req.body.descuentoP = 0.00;
    req.body.descuentoC = 0.00;
    req.body.disponible = true;

    const producto = new Producto(req.body);

    await ListaProductos.findOneAndUpdate({'_id':req.body.listaProductos},{$push:{productos:producto}});
    
    res.json(
        producto
    );

}

const modificarProducto = async(req,res = response) => {
   
    try{

        await ListaProductos.findOneAndUpdate(
            {
                _id:req.body.uid,'productos._id':mongoose.Types.ObjectId(req.body.producto_uid)
            },
            {
                $set:{
                    'productos.$.categoria':req.body.categoria,
                    'productos.$.nombre':req.body.nombre,
                    'productos.$.nombre':req.body.nombre,
                    'productos.$.precio':req.body.precio,
                    'productos.$.descripcion':req.body.descripcion,
                    'productos.$.descuentoP':req.body.descuentoP,
                    'productos.$.descuentoC':req.body.descuentoC,
                    'productos.$.disponible':req.body.disponible,
                }
            }
        );
    
        return res.json({
            ok:true
        });
    }catch(e){
        return res.json({
e
        });
    }

}

module.exports = {nuevoProducto,modificarProducto};

