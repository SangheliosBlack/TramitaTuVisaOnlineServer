const {response} = require('express');
const mongoose = require('mongoose');
const Usuario = require('../models/usuario');
const fs = require("fs");
const s3 = require("../config/s3.config.js");
const path = require('path');

const updateDireccionFavorita = async(req,res = response)=>{
    await  Usuario.findByIdAndUpdate({'_id':req.uid},{$set:{direccionFavorita:req.body.direccionFavorita}});
  
    res.json({
      ok:true
    });
  }

const guardarFotoPerfil = async(req,res = response)=>{
    
    const usuario = await Usuario.findById(req.uid);

    const ext = path.extname(req.file.path);
    
    const s3Client = s3.s3Client;
    var paramsDelete= {  Bucket:process.env.Bucket , Key: usuario.profile_photo_key};
    const params = s3.uploadParams;
    
    
    fs.readFile(req.file.path,async function( err, data)  {
        
        params.Bucket      =process.env.Bucket,
        params.Key         = `storage/${usuario._id}/`+`profile_image_${Date.now()}`+ext,
        params.Body        = data,
        params.ContentType =req.file.ContentType

        const complete = new Promise((resolve)=>{
              s3Client.upload(params,(err,data)=>{
                 resolve(data);
             });
        });
    
        complete.then( async (newData)=>{

            if(usuario.profile_photo_key){

                const deleteComplete = new Promise((resolve)=>{
                    s3Client.deleteObject(paramsDelete,(err,data)=>{
                        resolve(data);
                    });
                });

                deleteComplete.then(async(deleteObject)=>{

                    await Usuario.findByIdAndUpdate(req.uid,{$set:{profile_photo_key:newData.Key}});

                    return res.json({ok:true,url:newData.Key});

                });
                
            }else{
                
                await Usuario.findByIdAndUpdate(req.uid,{$set:{profile_photo_key:newData.Key}});
    
                return res.json({ok:true,url:newData.Key});
                
            }

            
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