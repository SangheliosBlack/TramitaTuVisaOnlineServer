const { Schema,model } = require('mongoose');

const ComentariosSchema = Schema({
    usuario:{
        type:Schema.Types.ObjectId,
        require:true
    },
    comentario:{
        type:String,
        require:true
    },
    encabezado:{
        type:String,
        require:true
    },
    calificacion:{
        type:Number,
        require:true
    },
    reacciones:{
        type:Number,
        require:true
    },
    destacado:{
        type:Boolean,
        require:true
    },
    sub_respuesta:{
        type:Boolean,
        require:true
    },
    eliminado:{
        type:Boolean,
        require:true
    }
});

ComentariosSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('Comentarios',ComentariosSchema);