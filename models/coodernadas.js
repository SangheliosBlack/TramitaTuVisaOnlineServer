const {Schema,model} = require('mongoose');

const mongoose = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;

const CoordenadasSchema = Schema({
    latitud:{
        type: Number,
        require:true
    },
    longitud:{
        type: Number,
        require:true
    }
});

CoordenadasSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('Coordenadas',CoordenadasSchema);