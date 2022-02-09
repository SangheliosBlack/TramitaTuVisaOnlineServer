const {Schema,model} = require('mongoose');

const DireccionSchema = Schema({
    coordenadas:{
        type:Object,
        require:true,
    },
    texto:{
        type:String,
        require:true
    },
    descripcion:{
        type:String,
        require:true
    },
    icono:{
        type:Number,
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