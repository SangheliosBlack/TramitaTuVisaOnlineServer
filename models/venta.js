const { Schema,model } = require('mongoose');

const VentaSchema = Schema({
    pedidos:{
        type:Array,
        require:true
    },
    total:{
        type:Number,
        require:true
    },
    ganancia:{
        type:Number,
        require:true
    },
    gananciaEnvio:{
        type:Number,
        require:true
    },
    efectivo:{
        type:Boolean,
        require:true
    },
    imagen:{
        type:String,
        require:true
    },
    metodoPago:{
        type:Object,
        require:false
    },
    usuario:{
        type:Schema.Types.ObjectId,
        require:true
    },
    envio:{
        type:Number,
        require:true,
    },
    envioDescuento:{
        type:Number,
        require:true,
    }
},{
    timestamps:true
});

VentaSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('Ventas',VentaSchema);