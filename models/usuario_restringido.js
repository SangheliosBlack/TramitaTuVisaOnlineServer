const {Schema,model} = require('mongoose');

const RestringidoSchema = Schema({
    razon:{
        type:String,
        require:true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        require:true,
        ref:'Usuario'
    },
},{
    timestamps:true
});

 
RestringidoSchema.method('toJson',function(){

    const{__v,id,...object }= this.toObject();
    return object;

});

module.exports = model('Restringidos',RestringidoSchema);