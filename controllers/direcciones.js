const {response} = require('express');
const mongoose = require('mongoose');
const Direccion = require('../models/direccion');
const Coordendas = require('../models/coodernadas');
const Usuario = require('../models/usuario');
const Axios = require('axios');


const getDirecciones = async (req,res = response)=>{

    var direcciones = await Usuario.findById({_id:req.uid});


    res.json({
        ok:true,
        direcciones:direcciones.direcciones
    });
}

const searchOne = async (req,res = response)=>{


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

    res.json(
        direccion[0].list[0]
    );
}

const eliminarDireccion = async (req,res)=>{
    
    const id = req.body.id;

    try {
        await Usuario.findByIdAndUpdate(req.uid,{$pull:{direcciones:{_id:mongoose.Types.ObjectId(id)}}});
        return res.json({ok:true});
    } catch (error) {
        return res.json({ok:true});
    }


}

const direccionPredeterminada = async(req,res)=>{


        if(req.body.actual != 'NA'){

            await Usuario.findOneAndUpdate(
                {
                    _id:req.uid,'direcciones._id':mongoose.Types.ObjectId(req.body.actual)
                },
                {
                    $set:{
                        'direcciones.$.predeterminado':false,
                    }
                }
            );

        }

        await Usuario.findOneAndUpdate(
            {
                _id:req.uid,'direcciones._id':mongoose.Types.ObjectId(req.body.id)
            },
            {
                $set:{
                    'direcciones.$.predeterminado':req.body.estado,
                }
            }
        );

        return res.status(200);

}

const nuevaDireccion = async (req,res = response)=>{

    const id = req.body.id;


    if(req.body.sugerencia){

        const coodernadas = new Coordendas(req.body);
    
            req.body.coordenadas = coodernadas;

            req.body.predeterminado = false;
    
            const direccion = new Direccion(req.body);
    
            direccion.titulo =response.data.results[0].formatted_address;
    
            await Usuario.findByIdAndUpdate({_id:req.uid},{$push:{direcciones:direccion}});
    
            res.json({
                ok:true,
                direcciones:[direccion],
            });

    }else{
        Axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
            params:{
                place_id:id,
                key: process.env.GOOGLE_GEOCODE_API,
            }
        }).then( async function(response){
            
            const coodernadas = new Coordendas(response.data.results[0].geometry.location);
    
            req.body.coordenadas = coodernadas;

            req.body.predeterminado = false;
    
            const direccion = new Direccion(req.body);
    
            direccion.titulo =response.data.results[0].formatted_address;
    
            await Usuario.findByIdAndUpdate({_id:req.uid},{$push:{direcciones:direccion}});
    
            res.json({
                ok:true,
                direcciones:[direccion],
            });
            
        }).catch(function(e){
            return res.status(400).json({
                ok:false
            })
        });
    }


}



module.exports = { getDirecciones,nuevaDireccion,searchOne,eliminarDireccion,direccionPredeterminada};