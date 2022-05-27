const { Schema,model } = require('mongoose');

const PedidoSchema = Schema({
    productos:{
        type:Array,
        require:true
    },
    total:{
        type:Number,
        require:true
    },
    tienda:{
        type:String,
        require:true
    },
    repartidor:{
        type:String,
        require:true
    },
    entregado:{
        type:Boolean,
        require:true
    },
    imagen:{
        type:String,
        require:true
    },
    pagado:{
        type:Boolean,
        require:true
    },
    preparado:{
        type:Boolean,
        require:true
    },
    enviado:{
        type:Boolean,
        require:true
    },
    entregado:{
        type:Boolean,
        require:true
    },
    ubicacion:{
        type:Object,
        require:true
    }

    
},{
    timestamps:true
});


PedidoSchema.method('toJson',function(){
    const{__v,id,...object }= this.toObject();
    return object;
});

module.exports = model('Pedidos',PedidoSchema);