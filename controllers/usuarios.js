const {response} = require('express');
const mongoose = require('mongoose');
const Usuario = require('../models/usuario');
const fs = require("fs");
const s3 = require("../config/s3.config.js");
const usuario = require('../models/usuario');

const updateDireccionFavorita = async(req,res = response)=>{
    await  Usuario.findByIdAndUpdate({'_id':req.uid},{$set:{direccionFavorita:req.body.direccionFavorita}});
  
    res.json({
      ok:true
    });
  }

const guardarFotoPerfil = async(req,res = response)=>{
    
    const usuario = await Usuario.findById(req.uid);

    fs.readFile(req.file.path,async function( err, data)  {
        
        const s3Client = s3.s3Client;

        const params = s3.uploadParams;
    
        params.Bucket      =process.env.Bucket,
        params.Key         = `storage/${usuario._id}/`+`profile${Date.now()}`,
        params.Body        = data,
        params.ContentType ='image/jpeg'
    
        const complete = new Promise((resolve)=>{
              s3Client.upload(params,(err,data)=>{
                 resolve(data);
             });
        });
    
        complete.then((data)=>{
            res.json(data);
        });
    });


}  

const getUsuarios = async (req,res = response)=>{

    //const desde = Number(req.query.desde) || 0;

    console.log(req.uid);

    const data = await Usuario.aggregate([
        {
            $match:{_id:mongoose.Types.ObjectId(req.uid)}
        },
        {
            $lookup:{
                from:'usuarios',
                let:{'store':'$store','admin':'$admin'},
                pipeline:[{
                    $match:{
                        $expr:{
                            $and:[
                                {$eq:['$$store','$store']},
                                {$eq:[false,'$admin']}
                            ]
                        }
                    }
                }],
                as:'usuarios'
            }
        }
    ]);

    const users = data[0].usuarios;

    
    //const usuarios = await Usuario.find({_id:{$ne:req.uid}}).sort('-online').skip(desde).limit(20);
    console.log(users);

    res.json({
        ok:true,
        usuarios:users
    });


    

}



module.exports = {getUsuarios,updateDireccionFavorita,guardarFotoPerfil};