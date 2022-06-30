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
    efectivo:{
        type:Boolean,
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
    servicio:{
        type:Number,
        require:true,
    },
    envioPromo:{
        type:Number,
        require:true,
    },
    direccion:{
        type:Object,
        require:true
    }
    
},{
    timestamps:true
});

VentaSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('Ventas',VentaSchema);