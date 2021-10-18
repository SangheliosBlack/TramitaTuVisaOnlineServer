const {Schema,model} = require ('mongoose');

const UsuarioSchema =  Schema({
    customerID:{
        type:String,
        required:false
    },
    tiendas:{
        type:Array,
        required:false
    },
    tiendaFavorita:{
        type:Schema.Types.ObjectId,
        required:false
    },
    direccionFavorita:{
        type:Schema.Types.ObjectId,
        required:false
    },
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    online:{
        type:Boolean,
        default:false
    },
    hokage:{
        type:Boolean,
        require:true
    },
    direcciones:{
        type:Array,
        required:false
    }
    
},{
    timestamps:true
});

UsuarioSchema.method('toJSON',function(){
    const {__v,_id,password,...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Usuario',UsuarioSchema);