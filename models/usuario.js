const {Schema,model} = require ('mongoose');

const UsuarioSchema =  Schema({
    codigo:{
        type:String,
        required:false,
        unique:true,
        sparse:true,
    },
    dialCode:{
        type:String,
        require:true
    },
    nombre:{
        type:String,
        require:true
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
    profile_photo_key:{
        type:String,
        require: false
    },
    numero_celular:{
        type:String,
        unique:true,
        required:false
    },
},{
    timestamps:true
});

UsuarioSchema.method('toJSON',function(){
    const {__v,_id,contrasena,...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Usuario',UsuarioSchema);