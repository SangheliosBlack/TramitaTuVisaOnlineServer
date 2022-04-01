const {Schema,model} = require('mongoose');

const DireccionSchema = Schema({
    coordenadas:{
        type:Object,
        require:true,
    },
    titulo:{
        type:String,
        require:true
    },
    predeterminado:{
        type:Boolean,
        require:true
    }
},{
    timestamps:true
});

DireccionSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('Direccion',DireccionSchema);