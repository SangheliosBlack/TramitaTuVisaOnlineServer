const { Schema,model } = require('mongoose');

const ItemCarritoSchema = Schema({
    tienda:{
        type:Schema.Types.ObjectId,
        require:true
    },
    producto:{
        type:Object,
        require:true
    },
    cantidad:{
        type:Number,
        require:true
    },
    subtotal:{
        type:Number,
        require:true
    }
});

ItemCarritoSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('Comentarios',ItemCarritoSchema);