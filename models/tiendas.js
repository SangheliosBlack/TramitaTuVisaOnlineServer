const {Schema,model} = require('mongoose');

const TiendasSchema = Schema({
    imagen_perfil:{
        type:String,
        require:false
    },
    fotografias:{
        type:String,
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
    punto_venta:{
        type:String,
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
    },
    online:{
        type:Boolean,
        require:true
    },
    tiempo_espera:{
        type:Number,
        require:true
    },
    auto_impresion:{
        type:Boolean,
        require:true
    },
    mac:{
        type:String,
        require:true
    },
    sugerencia:{
        type:Boolean,
        require:false
    },
    tienda_ropa:{
        type:Boolean,
        require:true
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