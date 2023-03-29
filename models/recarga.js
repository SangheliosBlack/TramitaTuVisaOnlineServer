const {Schema,model} = require('mongoose');

const RecargaSchema = Schema({
    cantidad:{
        type:Number,
        require:true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        require:true
    }
});

RecargaSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
},{
    timestamps:true
});

module.exports = model('Recarga',RecargaSchema);