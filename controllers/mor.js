const Eventos = require('../models/evento');
const Usuarios = require('../models/usuario');


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
            var busqueda = await Usuarios.findOne({numero_celular:"4775181093"});
            if(busqueda){       
                await Usuarios.findByIdAndUpdate({_id:"6352dde2642e410016f994fc"},{$push:{amigos:busqueda._id}})
                return res.status(200).json({ok:true,msg:"Amigo agregado",usuario:busqueda});
            }else{
                return res.status(200).json({ok:false,msg:"Este usuario no existe",usuario:""});
            }
        } catch (error) {
            return res.status(200).json({ok:false,msg:"Error",usuario:""});
        }

    },
    obtenerListadoAmigos:async(req,res)=>{

        Usuarios.
        findById({_id:"6352dde2642e410016f994fc"}).
        populate("amigos").
        exec(function(err,data){
            if(err){
                console.log(err);
                return res.status(400).json([]);
            }
            console.log(data);
            return res.status(200).json(data);
        });

    },
    

}

module.exports = controller;