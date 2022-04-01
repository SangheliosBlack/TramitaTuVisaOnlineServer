const {Schema,model} = require('mongoose');

const mongoose = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;

const CoordenadasSchema = Schema({
    lat:{
        type: Number,
        require:true
    },
    lng:{
        type: Number,
        require:true
    }
});

CoordenadasSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('Coordenadas',CoordenadasSchema);