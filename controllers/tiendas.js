const {response} = require('express');
const moment = require('moment');
const Tienda = require('../models/tiendas');
const Usuario = require('../models/usuario');
const Horario = require('../models/horario');
const ListaProductos = require('../models/lista_productos');

const construirPantallaPrincipalTiendas = async (req,res)=>{

    const tiendas = await Tienda.aggregate(
        [
            {
                $match:{}
            
            },
            {
                $addFields:{
                    "uid": "$_id",
                    "fotografias": "$fotografias",
                    "inventario": [],
                    "equipo": "$equipo",
                    "ventas": "$ventas",
                    "nombre": "$nombre",
                    "propietario": "$propietario",
                    "disponible": "$disponible",
                    "productos": [],
                    "createdAt": "$createdAt",
                    "updatedAt": "$updatedAt",
                    "horario": "$horario",
                    "aniversario": "$aniversario"
                }
            }
        ]
    );

        console.log(
           'logrado' 
        );

    return res.json({
        ok:true,        
        tiendas:tiendas,
    });

}


const construirPantallaPrincipalCategorias = async (req,res)=>{

    const categorias = await ListaProductos.aggregate(
        [
            {
                $match:{}
            },{
                $unwind:'$productos'
            },{
                $group:{
                    _id:0,
                    categorias:{$addToSet:'$productos.categoria'}
                }
            }
        ]
    );

    return res.json(
            categorias[0].categorias
    );

}

const construirPantallaPrincipalProductos = async (req,res)=>{

    const productos = await ListaProductos.aggregate(
        [
            {
                $match:{}
            },{
                $unwind:'$productos'
            },{
                $project:{
                    _id:'$productos._id',
                    categorias:'$productos.categoria',
                    nombre:'$productos.nombre',
                    precio:'$productos.precio',
                    descripcion:'$productos.descripcion',
                    descuentoP:'$productos.descuentoP',
                    descuentoC:'$productos.descuentoC',
                    disponible:'$productos.disponible',
                    comentarios:'$productos.comentarios',

                }
            }
        ]
    );


    return res.json({
        ok:true,
        productos
    });

}

const getTiendas = async (req,res = response)=>{

    const tienda = await Tienda.find({'propietario':req.uid});

    res.json({
        ok:true,
        tienda
    });
}

const modificarNombreTienda = async(req,res = response)=>{

    await Tienda.findByIdAndUpdate({_id:req.body.tienda},{$set:{nombre:req.body.nombre}});

    return res.json({
        ok:true
    });

}

const modificarStatus = async (req,res = response )=>{

    await Tienda.findByIdAndUpdate({_id:req.body.tienda},{$set:{disponible:req.body.disponible}});

    return res.json({
        ok:true
    });

}

const modificarAniversario = async(req,res = response) =>{

    await Tienda.findByIdAndUpdate({_id:req.body.tienda},{$set:{aniversario:req.body.aniversario}});

    res.json({
        ok:true,
    })

}

const modificarHorarioTienda = async(req,res = response) =>{

    const apertura = moment(req.body.apertura,'hh:mm').format();
    const cierre = moment(req.body.cierre,'hh:mm').format();

    var data = {apertura,cierre};

    const nuevoHorario = new Horario(data);

    await  Tienda.findByIdAndUpdate({_id:req.body.tienda},{$set:{horario:nuevoHorario}});

    res.json({
        ok:true,
    })
}

const searchOne = async (req,res = resposne) =>{
    
    const tienda = await Tienda.findById(req.body.uid);


    res.json(
       {ok:true,
       tienda
    }
    );
}

const nuevaTienda = async (req,res) =>{


    const newLista = await new ListaProductos();

    const newHorario = await new Horario();

    newHorario.apertura == new Date();
    newHorario.cierre == new Date();
    
    await newLista.save();

    req.body.horario = newHorario;

    req.body.propietario = req.uid;

    req.body.disponible = false;

    req.body.aniversario = new Date();

    req.body.productos = newLista._id;

    const nuevaTienda = new Tienda(req.body);

    await nuevaTienda.save();

    await Usuario.findOneAndUpdate({_id:req.uid},{$push:{tiendas:nuevaTienda._id}});

    res.json({
        ok:true,
        nuevaTienda,
    });

}

module.exports = {getTiendas,nuevaTienda,searchOne,modificarHorarioTienda,modificarAniversario,modificarNombreTienda,modificarStatus,construirPantallaPrincipalCategorias,construirPantallaPrincipalTiendas,construirPantallaPrincipalProductos};