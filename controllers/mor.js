const Eventos = require('../models/evento');
const Usuarios = require('../models/usuario');
const Amigo = require('../models/amigo');
const Reservacion = require('../models/reservacion');



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

            var miPerfil = await Usuarios.findById(req.uid);
            var busqueda = await Usuarios.findOne({numero_celular:req.body.numero});

            

            if(miPerfil.numero_celular==req.body.numero){

                return res.status(200).json({ok:false,msg:"No es posible esta accion",usuario:""});

            }

            console.log(miPerfil.amigos.some(e=> e.id_usuario == busqueda._id));

            if(miPerfil.amigos.some(e=> e.id_usuario == busqueda._id)){

                return res.status(200).json({ok:false,msg:"Este esta repetido",usuario:""});
            }

            if(busqueda){       

                var nuevoAmigo = new Amigo();
                nuevoAmigo.nombre = busqueda.nombre;
                nuevoAmigo.id_usuario = busqueda._id;


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

    }
    

}

module.exports = controller;