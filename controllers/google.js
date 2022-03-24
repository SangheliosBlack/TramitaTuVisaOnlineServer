const Axios = require('axios');

var controller = {



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
                strictbounds:true
            }
        }).then(function(response){
            return res.json({response:response.data});
        }).catch(function(e){
            console.log(e)  ;
            return res.json({
                ok:false
            })
        });

    }

};

module.exports = controller