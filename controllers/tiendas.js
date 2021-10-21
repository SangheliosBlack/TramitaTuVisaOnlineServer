const {response} = require('express');
const moment = require('moment');
const Tienda = require('../models/tiendas');
const Usuario = require('../models/usuario');
const Horario = require('../models/horario');

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
    })
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

const nuevaTienda = async(req,res = response ) =>{

    req.body.propietario = req.uid;

    req.body.disponible = false;

    const nuevaTienda = new Tienda(req.body);

    await nuevaTienda.save();

    await Usuario.findOneAndUpdate({_id:req.uid},{$push:{tiendas:nuevaTienda._id}});
    
    await Usuario.findOneAndUpdate({_id:req.uid},{$set:{tiendaFavorita:nuevaTienda._id}});



    res.json({
        ok:true,
        tienda,
    });
}

module.exports = {getTiendas,nuevaTienda,searchOne,modificarHorarioTienda,modificarAniversario,modificarNombreTienda,modificarStatus};