const s3 = require("../config/s3.config.js");
const Usuario = require('../models/usuario');
const { repartidores } = require('./test');
const mongoose = require('mongoose');
const path = require('path');
const fs = require("fs");

 var controller = {
    guardarFotoPerfil : async(req,res)=>{

        const usuario = await Usuario.findById(req.uid);
        const ext = path.extname(req.file.path);
        const s3Client = s3.s3Client;
        var paramsDelete= {  Bucket:process.env.Bucket , Key: usuario.profilePhotoKey};
        const params = s3.uploadParams;
        
        fs.readFile(req.file.path,async function( err, data)  {
            
            params.Bucket      = process.env.Bucket,
            params.Key         = `storage/${usuario._id}/`+`profile_image_${Date.now()}`+ext,
            params.Body        = data,
            params.ContentType = req.file.mimetype
    
            const complete = new Promise((resolve)=>{

                s3Client.upload(params,(err,data)=>{

                     resolve(data);
                
                });
            
            });
        
            complete.then( async (newData)=>{
    
                if(usuario.profilePhotoKey){
    
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
    
    } ,
    modificarNombre : async(req, res)=>{
        
        await Usuario.findOneAndUpdate({_id:req.uid},{$set:{nombre:req.body.nombre}});
    
        res.json({
            ok:true
        });
    
    },
    modificarNombreUsuario : async(req, res)=>{
        
        await Usuario.findOneAndUpdate({_id:req.uid},{$set:{nombre_usuario:req.body.nombre_usuario}});
    
        res.json({
            ok:true
        });
    
    },
    modificarAvatar:async(req,res)=>{

        try {

            await Usuario.findByIdAndUpdate({_id:req.uid},{$set:{avatar:req.body.avatar}});

            return res.status(200).json({ok:true});

        } catch (error) {

            return res.status(400).json({ok:false});

        }

    },
    agregarProductoCesta:async(req,res)=>{

        try {
            
            const producto = new Producto(req.body.producto);
            
            await Usuario.findByIdAndUpdate({_id:req.uid},{$push:{'cesta.productos':producto}});

            console.log('que paso');

            return res.status(200).json({ok:true});

        } catch (error) {

            console.log(error);

            return res.status(400).json({ok:false});

        }

    },
    eliminarCestaProductos:async(req,res)=>{

        try {

            await Usuario.findByIdAndUpdate({_id:req.uid},{'cesta.productos':[]});

            return res.status(200).json({ok:true});

        } catch (error) {

            return res.status(400).json({ok:false});

        }

    },
    eliminarProductoCesta:async(req,res)=>{

        try {
            
            await Usuario.findByIdAndUpdate(
                {
                    _id:req.uid
                },{
                    $pull:{'cesta.productos':{_id:mongoose.Types.ObjectId(req.body.id)}}
                }
            );

            return res.status(200).json({ok:true});

        } catch (error) {

            return res.status(200).json({ok:false});

        }

    },
    modificarCantidadProductoCesta:async(req,res)=>{

        await Usuario.updateMany(
            
            {
                "_id":mongoose.Types.ObjectId(req.uid),
            },
            {
                $set:{
                    'cesta.productos.$[i].cantidad':req.body.cantidad,
                }
            },
            {
                arrayFilters:[
                    {
                        "i._id":mongoose.Types.ObjectId(req.body.id),
                    }
                ]
            }
        );

        try {

            return res.status(200).json({ok:true});

        } catch (error) {

            return res.status(200).json({ok:false});

        }
    },
    ordenes:async(req,res)=>{

        Venta.
        find({usuario:mongoose.Types.ObjectId(req.uid)}).
        sort({'updatedAt':-1}).
        populate('pedidos.repartidor').
        populate({
            path:'pedidos.repartidor',
            populate:{path:'negocios'},
        }).
        exec(function(err,data){

            if(err) {

                return res.json({ok:false});

            }

            return res.json(data);

        });
        
    },
    buscarCodigo:async(req,res)=>{

        try {
            
            var codigo = await Usuario.findOne({codigo:req.body.codigo});

            var checkUsuario = await Usuario.findById({_id:req.uid});
    
            if(codigo){

                if(checkUsuario.envio_promo){

                    return res.status(200).json({
                        ok:false,
                        usuario:codigo.nombre,
                        id:codigo._id,
                        msg:'Este codigo ya no es valido en tu cuenta'
                    });
                    
                }else{

                    return res.status(200).json({
                        ok:true,
                        usuario:codigo.nombre,
                        id:codigo._id,
                        msg:'Codigo disponible'
                    });

                }
                

            }else{

                return res.status(200).json({
                    ok:false,
                    usuario:'',
                    id:'',
                    msg:'Este codigo promocional no existe'
                });
                
            }
    
        } catch (error) {
            
            return res.status(400).json({ok:false});

        }

    }

}

module.exports = controller 