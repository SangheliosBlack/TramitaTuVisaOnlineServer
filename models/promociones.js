const {Schema, model} = require('mongoose');

const PromocionesSchema = Schema({
    titulo:{
        type:String,
        require:true
    },
    cantidad:{
        type:Number,
        require:true
    },
    descuento:{
        type:Number,
        require:true
    },
    activo:{
        type:Boolean,
        require:true
    },
    sku:{
        type:String,
        require:true
    }
});

PromocionesSchema.method('toJSON',function(){
    const {__v,_id,...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Promociones',PromocionesSchema);