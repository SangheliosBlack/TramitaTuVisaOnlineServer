const {Schema,model} = require('mongoose');

const RutaSchema = Schema({
    bounds:{
        type:Object,
        require:true
    },
    overview_polyline:{
        type:Object,
        require:true
    },
    distance:{
        type:Object,
        require:true
    },
    duration:{
        type:Object,
        require:true
    }
});
 
RutaSchema.method('toJson',function(){

    const{__v,id,...object }= this.toObject();
    return object;

});

module.exports = model('Rutas',RutaSchema);