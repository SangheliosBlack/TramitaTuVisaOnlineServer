const {Schema,model} = require('mongoose');

const ProductosSchema = Schema({
    categoria:{
        type:String,
        require:true
    },
    comentarios:{
        type:Array,
        require:false
    },
    nombre:{
        type:String,
        require:true
    },
    precio:{
        type:Number,
        require:true,
    },
    descripcion:{
        type:String,
        require:true
    },
    descuentoP:{
        type:Number,
        require:true
    },
    descuentoC:{
        type:Number,
        require:true
    },
    promocion:{
        type:Schema.Types.ObjectId,
        require:false
    },
    disponible:{
        type:Boolean,
        require:true
    },
    foto:{
        type:String,
        require:false
    },
});

ProductosSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('Productos',ProductosSchema);