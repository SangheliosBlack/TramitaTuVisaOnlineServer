const Producto = require('../models/productos');
const Tiendas = require('../models/tiendas');

const nuevoProducto = async (req,res = response)=>{

    req.body.descuentoP = 0.00;
    req.body.descuentoC = 0.00;
    req.body.disponible = true;

    const producto = new Producto(req.body);

    await Tiendas.findOneAndUpdate({'_id':req.body.tienda},{$push:{productos:producto}});
    
    res.json(
        producto
    );



}

module.exports = {nuevoProducto};

