const { Schema, model }= require('mongoose');

const EstadoSchema = Schema({
    mantenimiento:{
        type:Boolean,
        require:true
    },
    disponible:{
        type:Boolean,
        require:true
    },
    cerrada:{
        type:Boolean,
        require:true
    },
    version:{
        type:String,
        require:true
    }
        
});

EstadoSchema.method('JSON',function(){
    const {__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('Estado',EstadoSchema);