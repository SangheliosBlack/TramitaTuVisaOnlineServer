const { Schema, model } = require('mongoose');

const AmigoSchema = Schema({
    id_usuario:{
        type:Schema.Types.ObjectId,
        require:true
    },
    nombre:{
        type:String,
        require:true
    },
    nombre:{
        type:String,
        require:true
    },
    celular:{
        type:String,
        require
    }
});

AmigoSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
})

module.exports = model('Amigo',AmigoSchema)