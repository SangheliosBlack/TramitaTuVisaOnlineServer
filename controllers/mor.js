const Eventos = require('../models/evento');
const Usuarios = require('../models/usuario');


var controller = {

    obtenerEventos:async(req,res)=>{

        try {

            var eventos = await Eventos.find();

            console.log(eventos);

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
                await Usuarios.findByIdAndUpdate({_id:"6352dde2642e410016f994fc"},{$push:{amigos:"Luis Jaman"}})
                return res.status(200).json({ok:true,msg:"Amigo agregado",usuario:"Luis Jaman"});
            }else{
                return res.status(200).json({ok:false,msg:"Este usuario no existe",usuario:""});
            }
        } catch (error) {
            return res.status(200).json({ok:false,msg:"Error",usuario:""});
        }

    },
    obtenerListadoAmigos:async(req,res)=>{

        try {
            const listaAmigos = await Usuarios.findById({_id:"6352dde2642e410016f994fc"});
            return res.status(200).json(listaAmigos.amigos);
        } catch (error) {
            return res.status(400);
        }

    },
    

}

module.exports = controller;