const { Schema,model } = require('mongoose');

const CarritoSchema = Schema({
    total:{
        type:String,
        require:true
    },
    productos:{
        type:Array,
        require:true
    },
    
});

CarritoSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('Comentarios',CarritoSchema);