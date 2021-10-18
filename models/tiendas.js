const {Schema,model} = require('mongoose');

const TiendasSchema = Schema({
    propietario:{
        type:Schema.Types.ObjectId,
        require:true
    },
    nombre:{
        type:String,
        require:true
    },
    icono:{
        type:String,
        require:false
    },
    fotografias:{
        type:Array,
        require:false
    },
    productos:{
        type:Array,
        require:false
    },
    direccion:{
        type:String,
        require:false
    },
    coordenadas:{
        type:Object,
        require:false
    },
    horario:{
        type:Object,
        require:false
    },
    equipo:{
        type:Array,
        require:false
    },
    aniversario:{
        type:String,
        require:false
    },
    disponible:{
        type:Boolean,
        require:false
    }
    

},{
    timestamps:true
});

TiendasSchema.method('toJSON',function(){
    const {__v,_id,password,...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Tiendas',TiendasSchema);