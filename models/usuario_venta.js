const {Schema,model} = require ('mongoose');
const { schema } = require('./tiendas');

const UsuarioVenta  = Schema({
    imagen:{
        type:String,
        require:true,
    },
    nombre:{
        type:String,
        require:true,
    }
});

UsuarioVenta.method('toJSON',function(){
    const {__v,_id,contrasena,...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('UsuarioVenta',UsuarioVenta);