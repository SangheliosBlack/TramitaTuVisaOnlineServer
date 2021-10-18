const {response} = require('express');
const mongoose = require('mongoose');
const Direccion = require('../models/direccion');
const Coordendas = require('../models/coodernadas');
const Usuario = require('../models/usuario');



const updateName = async(req,res = response) =>{
    await Usuario.findOneAndUpdate(
        {_id:req.uid,'direcciones._id':mongoose.Types.ObjectId(req.body.direccionUid)},
        {$set:{'direcciones.$.titulo':req.body.nuevoTitulo}}
    )
    res.json({
        ok:true
    });
}

const updateIcon = async (req,res = response) =>{

    await Usuario.findOneAndUpdate(
        {_id:req.uid,'direcciones._id':mongoose.Types.ObjectId(req.body.direccionUid)},
        {$set:{'direcciones.$.icono':req.body.nuevoIcono}}
    );

    res.json({
        ok:true,
    });

};

const getDirecciones = async (req,res = response)=>{

    var direcciones = await Usuario.findById({_id:req.uid});

    res.json({
        ok:true,
        direcciones:direcciones.direcciones
    });
}

const searchOne = async (req,res = response)=>{

    console.log(req.body.uid);

    var direccion = await Usuario.aggregate([
        {$match:{_id:mongoose.Types.ObjectId(req.uid)}},
        {$project:{
            list:{$filter:{
                input:'$direcciones',
                as:'direccion',
                cond:{$eq:['$$direccion._id', mongoose.Types.ObjectId(req.body.uid)]}
            }}
        }}
    ])

    console.log(direccion);

    res.json(
        direccion[0].list[0]
    );
}

const nuevaDireccion = async (req,res = response)=>{

    const coodernadas = new Coordendas(req.body);

    req.body.coordenadas = coodernadas;
    req.body.favorito = false;
    req.body.titulo = 'Casa';

    const direccion = new Direccion(req.body);
    
    var nuevaDireccion = await Usuario.findByIdAndUpdate({_id:req.uid},{$push:{direcciones:direccion}});
    

    res.json({
        ok:true,
        direcciones:[direccion]
    });
}

module.exports = { getDirecciones,nuevaDireccion,searchOne,updateIcon,updateName};