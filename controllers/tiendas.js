const {response} = require('express');
const moment = require('moment');
const Tienda = require('../models/tiendas');
const Usuario = require('../models/usuario');
const Horario = require('../models/horario');
const ListaProductos = require('../models/lista_productos');
const mongoose = require('mongoose');
const { json } = require('express/lib/response');

const construirPantallaPrincipalTiendas = async (req,res)=>{

    const tiendas = await Tienda.aggregate(
        [
            {
                $match:{}
            
            },
            {
                $addFields:{
                    'uid':'$_id',
                    'listaProductos':[]
                }
            }
            
            
        ]
    );

    return res.json({
        ok:true,        
        tiendas,
    });

}

const busqueda = async(req,res)=>{

    const listaTiendas = await Tienda.aggregate(
        [
            {
                $match:{}
            
            },
            {
                $addFields:{
                    'uid':'$_id',
                }
            }
            
            
        ]
    );

    const listaProductos = await ListaProductos.aggregate(
        [
            {
                $match:{}
            },{
                $unwind:'$productos'
            },{
                $project:{
                    _id:'$productos._id',
                    categorias:'$productos.categoria',
                    nombre:'$productos.nombre',
                    precio:'$productos.precio',
                    descripcion:'$productos.descripcion',
                    descuentoP:'$productos.descuentoP',
                    descuentoC:'$productos.descuentoC',
                    disponible:'$productos.disponible',
                    comentarios:'$productos.comentarios',

                }
            }
        ]
    );


    var busqueda = req.body.busqueda.toLowerCase();

    function autocompleteMatchProductos(input) {
        if (input == '') {
          return [];
        }
        var reg = new RegExp(input)
        
        return listaProductos.filter(function(term) {
            if (term.nombre.toLowerCase().match(reg)) {
              return term;
            }
        });
      }

    function autocompleteMatchTiendas(input) {
        if (input == '') {
          return [];
        }
        var reg = new RegExp(input)
        
        return listaTiendas.filter(function(term) {
            if (term.nombre.toLowerCase().match(reg)) {
              return term;
            }
        });
      }

    var productos = autocompleteMatchProductos(busqueda)

    var tiendas = autocompleteMatchTiendas(busqueda);

    return res.json({
        ok:true,
        productos,
        tiendas
    })

}

const verTodoProductos = async(req,res)=>{



    const productos = await ListaProductos.aggregate(
        [
            {
                $match:{}
            },{
                $unwind:'$productos'
            },{
                $project:{
                    _id:'$productos._id',
                    categorias:'$productos.categoria',
                    nombre:'$productos.nombre',
                    precio:'$productos.precio',
                    descripcion:'$productos.descripcion',
                    descuentoP:'$productos.descuentoP',
                    descuentoC:'$productos.descuentoC',
                    disponible:'$productos.disponible',
                    comentarios:'$productos.comentarios',

                }
            }
        ]
    );

    return res.json({
        ok:true,        
        productos
    });

}

const verTodoTiendas = async (req,res)=>{

  const tiendas = await Tienda.aggregate(
            [
                {
                    $match:{}
                
                },
                {
                    $addFields:{
                        'uid':'$_id',
                    }
                }
                
                
            ]
        );

        return res.json({
            ok:true,        
            tiendas,
        });



}
const obtenerProductosTienda = async (req,res)=>{

    const body = req.body;

    const tienda = await ListaProductos.aggregate(
        [
            {
                $match:{
                    '_id':mongoose.Types.ObjectId('61feb3738c928f18cc164f6f')
                }
            
            },
            {
                $lookup:{
                    from: 'listaproductos',
                    localField: 'productos',
                    foreignField: '_id',
                    as:'listaProductos'
                }
            }
            
            
        ]
    );

    const categorias = await ListaProductos.aggregate(
        [
            {
                $match:{
                    '_id':mongoose.Types.ObjectId('61feb3738c928f18cc164f6f')
                }
            },{
                $unwind:'$productos'
            },{
                $group:{
                    _id:0,
                    categorias:{$addToSet:'$productos.categoria'}
                }
            }
        ]
    );

    var definitivo =  [];

    

    categorias[0].categorias.forEach(function(currentValue1, index1){

        var pre = {};
        
        pre.titulo = currentValue1;
        pre.productos = [];

        definitivo.push(pre);

        tienda[0].productos.forEach(function(currentValue2, index2){
            if(currentValue1 == currentValue2.categoria){
                definitivo[index1].productos.push(currentValue2);
            }
            
        });
        
    });

    return res.json(
        {
            ok:true,
            productos:definitivo
        }
    );

}


const construirPantallaPrincipalCategorias = async (req,res)=>{

    const categorias = await ListaProductos.aggregate(
        [
            {
                $match:{}
            },{
                $unwind:'$productos'
            },{
                $group:{
                    _id:0,
                    categorias:{$addToSet:'$productos.categoria'}
                }
            }
        ]
    );

    return res.json(
            categorias[0].categorias
    );

}

const obtenerProductosCategoria = async(req,res)=>{


    const productos = await ListaProductos.aggregate(
        [
            {
                $match:{}
            },{
                $project:{
                   productos:{
                           $filter:{
                               input:'$productos',
                               as:'item',
                               cond:{$eq:['$$item.categoria',req.body.filtro]}
                           }
                   }
                }
            },
        ]
    );


    return res.json({
        ok:true,
        productos:productos[0].productos
    })
}

const construirPantallaPrincipalProductos = async (req,res)=>{

    const productos = await ListaProductos.aggregate(
        [
            {
                $match:{}
            },{
                $unwind:'$productos'
            },{
                $project:{
                    _id:'$productos._id',
                    categorias:'$productos.categoria',
                    nombre:'$productos.nombre',
                    precio:'$productos.precio',
                    descripcion:'$productos.descripcion',
                    descuentoP:'$productos.descuentoP',
                    descuentoC:'$productos.descuentoC',
                    disponible:'$productos.disponible',
                    comentarios:'$productos.comentarios',
                    tienda:'$tienda',
                }
            }
        ]
    );

    console.log(productos);
    var index = 0;
    var separados = [];
    var contador = 1;
    var limite = 0;

    do{
        if(index==0){
            var nuevo = {};
            nuevo.linea = limite;
            nuevo.productos = [];
            separados.push(nuevo);
        }else if(contador >= 4){
            limite ++;
            contador = 1;
            var nuevo = {};
            nuevo.linea = limite;
            nuevo.productos = [];
            separados.push(nuevo);
        }
        separados[limite].productos.push(productos[index])
        index++;
        contador ++;
    }while(index<productos.length);




    return res.json({
        ok:true,
        separados
    });

}

const obtenerTienda = async (req,res = response)=>{

    const usuario = await Usuario.findById(req.uid);

    const tienda = await Tienda.findById(usuario.tienda);

    const productos = await ListaProductos.findById(tienda.productos);

    tienda.listaProductos = productos.productos;


    res.json(
        tienda
    );
}

const modificarNombreTienda = async(req,res = response)=>{

    await Tienda.findByIdAndUpdate({_id:req.body.tienda},{$set:{nombre:req.body.nombre}});

    return res.json({
        ok:true
    });

}

const modificarStatus = async (req,res = response )=>{

    await Tienda.findByIdAndUpdate({_id:req.body.tienda},{$set:{disponible:req.body.disponible}});

    return res.json({
        ok:true
    });

}

const modificarAniversario = async(req,res = response) =>{

    await Tienda.findByIdAndUpdate({_id:req.body.tienda},{$set:{aniversario:req.body.aniversario}});

    res.json({
        ok:true,
    })

}

const modificarHorarioTienda = async(req,res = response) =>{

    const apertura = moment(req.body.apertura,'hh:mm').format();
    const cierre = moment(req.body.cierre,'hh:mm').format();

    var data = {apertura,cierre};

    const nuevoHorario = new Horario(data);

    await  Tienda.findByIdAndUpdate({_id:req.body.tienda},{$set:{horario:nuevoHorario}});

    res.json({
        ok:true,
    })
}

const searchOne = async (req,res = resposne) =>{
    
    const tienda = await Tienda.findById(req.body.uid);


    res.json(
       {ok:true,
       tienda
    }
    );
}

const nuevaTienda = async (req,res) =>{

    const newLista = await new ListaProductos();

    const newHorario = await new Horario();

    newHorario.apertura = new Date();
    
    newHorario.cierre = new Date();
    
    await newLista.save();

    req.body.horario = newHorario;

    req.body.propietario = req.uid;

    req.body.disponible = false;

    req.body.aniversario = new Date();

    req.body.productos = newLista._id;

    const nuevaTienda = new Tienda(req.body);

    await nuevaTienda.save();

    await Usuario.findOneAndUpdate({_id:req.uid},{$push:{tiendas:nuevaTienda._id}});

    res.json({
        ok:true,
        nuevaTienda,
    });

}

module.exports = {busqueda,verTodoProductos,obtenerTienda,obtenerProductosCategoria,verTodoTiendas,nuevaTienda,searchOne,modificarHorarioTienda,modificarAniversario,modificarNombreTienda,modificarStatus,construirPantallaPrincipalCategorias,construirPantallaPrincipalTiendas,construirPantallaPrincipalProductos,obtenerProductosTienda};