const { Schema,model } = require('mongoose');

const InventarioSchema = Schema({
    produtos:{
        type:Array,
        require:true
    }
},{
    timestamps:true
});

InventarioSchema.method('toJSON',function(){
    const {__v,_id,...object} = this.toObject();
    return object;
}); 

module.exports = model('Inventarios',InventarioSchema);