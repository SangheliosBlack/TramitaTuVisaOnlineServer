const ListaProductos = require('../models/lista_productos');
const Producto = require('../models/producto');
const Tiendas = require('../models/tiendas');
const { response } = require('express');
const mongoose = require('mongoose');

var controller = {
    buscarSku:async(req,res)=>{

        var producto = await ListaProductos.find({'productos.sku':'8506622579'},{'_id':0,'productos.$':1});

        var producto_parse =producto[0].productos[0]

        return res.json(producto_parse);

    },
    nuevoProducto:async(req,res)=>{

        req.body.descuentoP = 0.00;
        req.body.descuentoC = 0.00;
        req.body.disponible = true;

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

}

module.exports = controller;

