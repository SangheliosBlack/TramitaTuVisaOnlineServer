const ListaProductos = require('../models/lista_productos');
const Producto = require('../models/producto');
const Tiendas = require('../models/tiendas');
const { response } = require('express');
const mongoose = require('mongoose');

var controller = {
    buscarSku:async(req,res)=>{

        var producto = await ListaProductos.find({'productos.sku':'8506622579'},{'_id':0,'productos.$':1});

        var producto_parse =producto[0].productos[0]

        return res.json(producto_parseI );

    },
    eliminarProducto:async(req,res)=>{

        var {lista_productos,id_producto} = req.body;

        try {
        
            await ListaProductos.updateMany({ 'nombre':lista_productos},{ $pull: { "productos._id": id_producto}},)
    
            return res.json({
                ok:true
            });
    
        } catch (error) {
            
            return res.json({
                true:false
            });
    
        }

    },
    nuevoProducto:async(req,res)=>{

        req.body.descuentoP = 0.00;
        req.body.descuentoC = 0.00;
        req.body.disponible = true;


        console.log(req.body);

        const producto = new Producto(req.body);

        producto.sku = Math.floor(100000 + Math.random() * 10000000000);
        producto.categoria = '';
        producto.subCategoria = '';
        producto.imagen = '';
        producto.tienda = req.body.tienda;
        producto.apartado = false;

        await ListaProductos.findOneAndUpdate({'_id':req.body.listaProductos},{$push:{productos:producto}});
    
        res.json(
            producto
        );

    },
    modificarProducto: async(req,res)=>{

        const {lista_uid,producto_uid,talla,nombre,precio,cantidad} = req.body;

        try{

            await ListaProductos.findOneAndUpdate(
                {
                    _id:lista_uid,'productos._id':mongoose.Types.ObjectId(producto_uid)
                },
                {
                    $set:{
                        'productos.$.descripcion':talla,
                        'productos.$.cantidad':cantidad,
                        'productos.$.nombre':nombre,
                        'productos.$.precio':precio,
                    }
                }
            );
        
            return res.status(200).json({
                ok:true
            });

        }catch(e){

            return res.status(400);
        }
        
    }

}

module.exports = controller;

