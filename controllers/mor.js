const Eventos = require('../models/evento');
const Usuarios = require('../models/usuario');
const Amigo = require('../models/amigo');
const Reservacion = require('../models/reservacion');
const { json } = require('express');
const mongoose = require('mongoose');



var controller = {

    obtenerEventos:async(req,res)=>{

        try {

            var eventos = await Eventos.find();

            return res.status(200).json(eventos );

        } catch (error) {

            console.log(error);
        
            return res.status(400);

        }

    },
    agregarAmigos:async(req,res)=>{

        try {

           
            var busqueda = await Usuarios.findOne({numero_celular:req.body.numero});

            if(busqueda){   

                var nuevoAmigo = new Amigo();
                nuevoAmigo.nombre = busqueda.nombre;
                nuevoAmigo.id_usuario = busqueda._id;
                nuevoAmigo.celular = busqueda.numero_celular;

                try {
                    await Usuarios.findByIdAndUpdate({_id:req.uid},{$push:{amigos:nuevoAmigo}})
                    return res.status(200).json({ok:true,msg:"Amigo agregado",usuario:nuevoAmigo});
                } catch (error) {
                    console.log(error);
                }
            }else{
                return res.status(200).json({ok:false,msg:"Este usuario no existe",usuario:""});
            }
        } catch (error) {
            console.log(error);
            return res.status(200).json({ok:false,msg:"Error",usuario:""});
        }

    },
    obtenerListadoAmigos:async(req,res)=>{

        var amigos = await Usuarios.findById({_id:req.uid});
        return res.status(200).json(amigos.amigos);

    },
    crearNuevoMesa: async(req,res)=>{

        

        var nuevaMesa = new Reservacion();

        nuevaMesa.mesa_id = req.body.mesa;
        nuevaMesa.lista_invitados = [];
        nuevaMesa.disponible = true;
        nuevaMesa.consumo_minimo = 4000;
        nuevaMesa.maximo_personas = 8;
        nuevaMesa.regular = false;
        nuevaMesa.regular_mesa = false ;
        nuevaMesa.vip = false;
        nuevaMesa.premium = true;

        await Eventos.findByIdAndUpdate({_id:"64bd5f6d0af7201d09d04a8b"},{$push:{reservaciones:nuevaMesa}});

    },
    agregarInvitado:async(req,res)=>{

        console.log(req.body);   

        await Eventos.findOneAndUpdate(
            {
                "_id":mongoose.Types.ObjectId(req.body.evento)
            },
            {
                $push:{"reservaciones.$[i].lista_invitados":mongoose.Types.ObjectId(req.body.usuario)}
            },
            {
                arrayFilters:[
                    {
                        "i._id":mongoose.Types.ObjectId(req.body.reservacion)
                    }
                ]
            }
        );

        return res.status(200).json({ok:true});

    },
    eliminarInvitado:async(req,res)=>{

        await Eventos.findOneAndUpdate(
            {
                "_id":mongoose.Types.ObjectId(req.body.evento)
            },
            {
                $pull:{"reservaciones.$[i].lista_invitados":mongoose.Types.ObjectId(req.body.usuario)}
            },
            {
                arrayFilters:[
                    {
                        "i._id":mongoose.Types.ObjectId(req.body.reservacion)
                    }
                ]
            }
        );

        return res.status(200).json({ok:true});

    },
    crearNuevaReserva:async(req,res)=>{

        try {

            console.log(req.body);

            console.log(req.uid);

            await Eventos.findOneAndUpdate(
                {
                    "_id":mongoose.Types.ObjectId(req.body.evento)
                },
                {
                    $set:{"reservaciones.$[i].administrador":mongoose.Types.ObjectId(req.uid)}
                },
                {
                    arrayFilters:[
                        {
                            "i._id":mongoose.Types.ObjectId(req.body.reservacion)
                        }
                    ]
                }
            );

            await Eventos.findOneAndUpdate(
                {
                    "_id":mongoose.Types.ObjectId(req.body.evento)
                },
                {
                    $push:{"reservaciones.$[i].lista_invitados":mongoose.Types.ObjectId(req.uid)}
                },
                {
                    arrayFilters:[
                        {
                            "i._id":mongoose.Types.ObjectId(req.body.reservacion)
                        }
                    ]
                }
            );

            return res.status(200).json({ok:true});
            
        } catch (error) {

                console.log(error);
            
            
            return res.status(400).json({ok:false});
        }

    }
    

}

module.exports = controller;