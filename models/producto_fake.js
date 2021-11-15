const {Schema,model} = require('mongoose');

const mongoose = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;

const ProductoFakeSchema = Schema({
    precio:{
        type: Number,
        require:true
    },
    nombre:{
        type: String,
        require:true
    },cantidad:{
        type: Number,
        require:true
    },codigo:{
        type:String,
        require:true
    }

});

ProductoFakeSchema.method('toJson',function(){
    const{__v,id,...object} = this.toObject();
    return object;
});

module.exports = model('ProductosFake',ProductoFakeSchema);