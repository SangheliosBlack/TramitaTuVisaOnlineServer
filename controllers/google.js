const Axios = require('axios');

var controller = {
    sugerencia: async function(req,res){

        const coordenadas = req.body.coordenadas;

        Axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
            params:{
                latlng:coordenadas,
                key: process.env.GOOGLE_GEOCODE_API,
                bounds:'21.3533019 -101.952672',
                language:'es-419',
                location_type:'ROOFTOP',
                components:'MEX|47400|Lagos de Moreno'
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
    ruta:async function(req,res){

        Axios.get('https://maps.googleapis.com/maps/api/directions/json',{
            params:{
                key:process.env.GOOGLE_DIRECTIONS_API,
                origin:'21.3724592,-101.9247371',
                destination:'21.3545099,-101.9325919',
                language:'es-419',
                region:'mx',
                mode:'driving'
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