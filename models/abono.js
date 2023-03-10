const { Schema, model } = require('mongoose');

const AbonoSchema = Schema({
    fecha:{
        type:Date,
        require:true
    },
    cantidad:{
        type:Number,
        require:true
    },
    titulo:{
        type:String,
        require:true
    }
});
;
AbonoSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
})

module.exports = model('Abono',AbonoSchema)