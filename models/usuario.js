const {Schema,model} = require ('mongoose');

const UsuarioSchema =  Schema({
    nombre_usuario:{
        type:String,
        require:true
    },
    nombre:{
        type:String,
        require:true
    },
    online:{
        type:Boolean,
        default:false
    },
    correo:{
        type:String,
        require:true,
        
        unique:true
    },
    contrasena:{
        type:String,
        required:true
    },
    direcciones:{
        type:Array,
        required:false
    },
    socio:{
        type:Boolean,
        required:true
    },
    customer_id:{
        type:String,
        required:false,
        sparse:true,
        unique:true,
    },
    profile_photo_key:{
        type:String,
        require: false
    },
    numero_celular:{
        type:String,
        unique:true,
        required:false
    },
    tienda:{
        type:Schema.Types.ObjectId,
        required:false
    },
    cesta:{
        type:Object,
        require :true
    }
},{
    timestamps:true
});

UsuarioSchema.method('toJSON',function(){
    const {__v,_id,contrasena,...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Usuario',UsuarioSchema);