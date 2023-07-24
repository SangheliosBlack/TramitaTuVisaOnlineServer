const { Schema, model } = require('mongoose');

const ReservacionSchema = Schema({

    mesa_id:{
        type:String,
        require:true
    },
    administrador:{
        type:Schema.Types.ObjectId,
        require:true
    },
    lista_invitados:{
        type:Array,
        require:true
    },
    disponible:{
        type:Boolean,
        require:true
    },
    consumo_minimo:{
        type:Number,
        require:true
    },
    maximo_personas:{
        type:Number,
        require:true
    },
    regular:{
        type:Boolean,
        require:true
    },
    regular_mesa:{
        type:Boolean,
        require:true
    },
    vip:{
        type:Boolean,
        require:true
    },
    premium:{
        type:Boolean,
        require:true
    },
})

ReservacionSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
})

module.exports = model('Reservacion',ReservacionSchema)