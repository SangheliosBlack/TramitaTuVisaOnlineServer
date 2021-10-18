const {Schema,model} = require('mongoose');

const ProductosSchema = Schema({
    precio:{
        type:Number,
        require:true,
    },
    nombre:{
        type:String,
        require:true
    },
    descripcion:{
        type:String,
        require:true
    },
    imagen:{
        type:String,
        require:false
    },
    descuentoP:{
        type:Number,
        require:true
    },
    descuentoC:{
        type:Number,
        require:true
    },
    disponible:{
        type:Boolean,
        require:true
    }
});

ProductosSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('Productos',ProductosSchema);