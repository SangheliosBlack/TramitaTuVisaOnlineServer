const Eventos = require('../models/evento');

var controller = {

    obtenerEventos:async(req,res)=>{

        try {

            var eventos = await Eventos.find();

            console.log(eventos);

            return res.status(200).json({eventos});

        } catch (error) {

            console.log(error);
        
            return res.status(400);

        }

    }

}

module.exports = controller;