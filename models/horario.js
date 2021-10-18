const {Schema,model} = require('mongoose');

const HorarioSchema = Schema({
    apertura:{
        type:Date,
        require:true
    },
    cierre:{
        type:Date,
        require:true
    }
});

HorarioSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('Horario',HorarioSchema);