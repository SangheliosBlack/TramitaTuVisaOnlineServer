const {Schema,model} = require('mongoose');

const TiendasSchema = Schema({
    fotografias:{
        type:Array,
        require:false
    },
    inventario:{
        type:Array,
        require: false
    },
    equipo:{
        type:Array,
        require:false
    },
    nombre:{
        type:String,
        require:true
    },
    propietario:{
        type:Schema.Types.ObjectId,
        require:true
    },
    disponible:{
        type:Boolean,
        require:true
    },
    aniversario:{
        type:Date,
        require:false
    },
    horario:{
        type:Object,
        require:false
    },
    icono:{
        type:Number,
        require:false
    },
    productos:{
        type:Schema.Types.ObjectId,
        require:false
    },
    direccion:{
        type:String,
        require:false
    },
    ventas:{
        type:Array,
        require:false
    },
    coordenadas:{
        type:Object,
        require:true,
    },
    listaProductos:{
        type:Array,
        require:false
    }
},{
    timestamps:true
});

TiendasSchema.method('toJSON',function(){
    const {__v,_id,...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Tiendas',TiendasSchema);