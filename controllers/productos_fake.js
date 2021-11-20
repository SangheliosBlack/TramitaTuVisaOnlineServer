const ProductoFake = require("../models/producto_fake");

const nuevoProductoFake = async (req,res = response) =>{
    const producto_fake = new ProductoFake(req.body);

    producto_fake.cantidad = 0;

    producto_fake.precio = 0;

    await producto_fake.save();

    console.log(producto_fake);
    console.log(producto_fake);
    console.log(producto_fake);
    console.log(producto_fake);
    console.log(producto_fake);
    console.log(producto_fake);
    console.log(producto_fake);
    console.log(producto_fake);

    return res.json({

        ok:true,
        producto_fake
    
    });
}

module.exports = {
    nuevoProductoFake
}