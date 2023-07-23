const {Schema,model} = require("mongoose");

const EventoSchema = Schema({
    nombre:{
        type:String,
        require:true
    },
    fecha_inicio:{
        type:Date,
        require:true,
    },
    fecha_fin:{
        type:Date,
        require:true,
    },
    cover:{
        type:String,
        require:true
    },
    reservaciones:{
        type:Array,
        require:true
    },
    disponible:{
        type:Boolean,
        require:true
    },
    descripcion:{
        type:String,
        require:true
    },
    line_up:{
        type:Array,
        require:true
    }
})

EventoSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
})

module.exports = model('Evento',EventoSchema)