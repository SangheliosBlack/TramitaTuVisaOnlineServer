const Axios = require('axios');

var controller = {

    sugerencia: async function(req,res){


        const coordenadas = req.body.coordenadas;

        Axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
            params:{
                latlng:coordenadas,
                key: process.env.GOOGLE_GEOCODE_API,
                language:'es-419',
                location_type:'ROOFTOP'
            }
        }).then(function(response){
            return res.json(response.data);
        }).catch(function(e){
            return res.json({
                ok:false
            })
        });
    },

    busquedaID: async function(req,res) {
        const id = req.body.id;

        Axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
            params:{
                place_id:'ChIJeRpOeF67j4AR9ydy_PIzPuM',
                key: process.env.GOOGLE_GEOCODE_API,
            }
        }).then(function(response){
            return res.json(response.data);
        }).catch(function(e){
            return res.json({
                ok:false
            })
        });

    },

    busqueda: async function(req,res){

        const query = req.body.query;

        Axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json',{
            params:{
                input:query,
                key: process.env.GOOGLE_PLACES_API,
                language:'es-419',
                region:'mx',
                location:'21.3533019 -101.952672',
                radius:7000,
                strictbounds:true,

            }
        }).then(function(response){
            return res.json(response.data);
        }).catch(function(e){
            return res.json({
                ok:false
            })
        });

    }

};

module.exports = controller