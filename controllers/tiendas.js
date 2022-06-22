const Notificacion = require('../notificaciones');


const {response} = require('express');
const moment = require('moment');
const Tienda = require('../models/tiendas');
const Usuario = require('../models/usuario');
const Horario = require('../models/horario');
const ListaProductos = require('../models/lista_productos');
const mongoose = require('mongoose');
const e = require('cors');

const Pedido = require('../models/pedido');
const Venta = require('../models/venta');

const stripe = require('stripe')('sk_test_51IDv5qAJzmt2piZ3A5q7AeIGihRHapcnknl1a5FbjTcqkgVlQDHyRIE7Tlc4BDST6pEKnXlcomoyFVAjeIS2o7SB00OgsOaWqW');

const crearPedido = async (req,res)=>{

    
    
    var {total,tarjeta,productos,efectivo,codigo} = JSON.parse(req.body.cesta);

    var {envio,usuario,servicio,customer} = req.body;


    var totalConfirmar = productos.reduce((previusValue,currentValue)=> previusValue+(currentValue.cantidad * currentValue.precio),0);

    const decimalCount = num => {
        const numStr = String(num);
        if (numStr.includes('.')) {
           return numStr.split('.')[1].length;
        };
        return 0;
    }

    if(!tarjeta){
        efectivo = true;
    }

    var venta = new Venta();

    venta.total = total;
    venta.efectivo = efectivo;
    venta.envio = envio;
    venta.usuario = usuario;
    venta.servicio = servicio;
    venta.envioPromo = codigo ? envio :0;

    if(efectivo){

        await stripe.transfers.create({
            amount: 10,
            currency: 'mxn',
            destination: 'acct_1JOjHVPOnuOXNxOm',
            transfer_group: venta.id
        });
        
        var pedidos = [];
    
        for(const element in productos){
    
            if(!pedidos.some(elem=> elem.tienda == productos[element].tienda)){
    
                var subElement = {};
    
                var datos_tienda = await Tienda.findOne({'nombre':productos[element].tienda})
    
                subElement.total = (productos[element].precio + productos[element].extra) * productos[element].cantidad;
                subElement.tienda = productos[element].tienda;
                subElement.productos = [productos[element]];
                subElement.repartidor = 'Pendiente';
                subElement.imagen = datos_tienda.imagen_perfil;
                subElement.ubicacion = datos_tienda.coordenadas;
    
    
                pedidos.push(subElement);
            }else{
    
                var objIndex = pedidos.findIndex((obj => obj.tienda == productos[element].tienda));
                pedidos[objIndex].total = pedidos[objIndex].total + ((productos[element].precio + productos[element].extra) * productos[element].cantidad);
                pedidos[objIndex].productos.push(productos[element]);
                
            }
        }
    
        var pedidosSchema = [];
        
        for(const element in pedidos){
            
            var pedidosModel = new Pedido(pedidos[element]);
    
    
            pedidosModel.pagado = true;
            pedidosModel.preparado = false;
            pedidosModel.enviado = false;
            pedidosModel.entregado = false;
            
            pedidosSchema.push(pedidosModel);
            
        }
        
        venta.pedidos = pedidosSchema;
        
        await venta.save();

        await Usuario.findByIdAndUpdate({_id:req.uid},{'cesta.productos':[],'envio_promo':codigo ? true :false});

        const data = {
            tokenId:'dQxN2WlUR_uGZytPuCVDQ9:APA91bHKyK0mPb1Xwi_ebSj1mL_DT99TakDp601kkYukud1Ns0VsXP2DbkI2wy8AIUaR-4Yl3wypf5FzIkeXXbl4iV2Y1-q_Welb59pAnqyrCiBDIq8rDrCMTKy_s_vYfMotYcnxlakk',
            titulo:'Enviado desde NodeJS',
            mensaje:'Si puede perros 7u7',
        };

        Notificacion.sendPushToOneUser(data);
    
        return res.status(200).json(venta);

    }else{

        const paymentIntent = await stripe.paymentIntents.create({
            amount: decimalCount(total) == 0 || decimalCount(total) == 1  ? total*100: total.replace('.',''),
            currency: 'mxn',
            customer:customer,
            payment_method_types: ['card'],
            transfer_group: venta.id
        });
    
        const paymentIntentConfirm = await stripe.paymentIntents.confirm(
            paymentIntent.id,
            {payment_method: tarjeta}
        );
    
        if(paymentIntentConfirm.status == 'succeeded'){
    
            venta.metodoPago = paymentIntentConfirm;
        
            await stripe.transfers.create({
                amount: 10,
                currency: 'mxn',
                destination: 'acct_1JOjHVPOnuOXNxOm',
                transfer_group: venta.id
            });
            
            var pedidos = [];
        
            for(const element in productos){
        
                if(!pedidos.some(elem=> elem.tienda == productos[element].tienda)){
    
                    var subElement = {};
        
                    var datos_tienda = await Tienda.findOne({'nombre':productos[element].tienda})
        
                    subElement.total = (productos[element].precio + productos[element].extra) * productos[element].cantidad;
                    subElement.tienda = productos[element].tienda;
                    subElement.productos = [productos[element]];
                    subElement.repartidor = 'Pendiente';
                    subElement.imagen = datos_tienda.imagen_perfil;
                    subElement.ubicacion = datos_tienda.coordenadas;
        
        
                    pedidos.push(subElement);
                }else{
        
                    var objIndex = pedidos.findIndex((obj => obj.tienda == productos[element].tienda));
                    pedidos[objIndex].total = pedidos[objIndex].total + ((productos[element].precio + productos[element].extra) * productos[element].cantidad);
                    pedidos[objIndex].productos.push(productos[element]);
                    
                }
            }
        
            var pedidosSchema = [];
            
            for(const element in pedidos){
                
                var pedidosModel = new Pedido(pedidos[element]);
        
        
                pedidosModel.pagado = true;
                pedidosModel.preparado = false;
                pedidosModel.enviado = false;
                pedidosModel.entregado = false;
                
                pedidosSchema.push(pedidosModel);
                
            }
            
            venta.pedidos = pedidosSchema;
            
            await venta.save();
    
            await Usuario.findByIdAndUpdate({_id:req.uid},{'cesta.productos':[],'envio_promo':codigo ? true :false});
        
            return res.status(200).json(venta);
    
        }else{
    
            return res.status(400).json({ok:false,msg:paymentIntentConfirm.status});
    
        }

    }

    


}

const construirPantallaPrincipalTiendas = async (req,res)=>{


    const tiendas = await Tienda.aggregate(
        [
            {
                $match:{}
            
            },{
                $lookup:{
                    from: 'listaproductos',
                    localField: 'productos',
                    foreignField: '_id',
                    as:'listaProductos'
                }
            },
            {
                $project:{
                    nombre:'$nombre',
                    propietario:'$propietario',
                    disponible:'$disponible',
                    productos:'$productos',
                    aniversario:'$aniversario',
                    createdAt:'$createdAt',
                    updatedAt:'$updatedAt',
                    uid:'$uid',
                    horario:'$horario',
                    coordenadas:'$coordenadas',
                    fotografias:'$fotografias',
                    inventario:'$inventario',
                    equipo:'$equipo',
                    ventas:'$ventas',
                    direccion:'$direccion',
                    online:'$online',
                    imagen_perfil:'$imagen_perfil',
                    listaProductos:{
                        $arrayElemAt:['$listaProductos',0]
                    }
                }
            },
            {
                $project:{
                    nombre:'$nombre',
                    propietario:'$propietario',
                    disponible:'$disponible',
                    productos:'$productos',
                    aniversario:'$aniversario',
                    createdAt:'$createdAt',
                    updatedAt:'$updatedAt',
                    uid:'$uid',
                    horario:'$horario',
                    coordenadas:'$coordenadas',
                    direccion:'$direccion',
                    fotografias:'$fotografias',
                    inventario:'$inventario',
                    online:'$online',
                    equipo:'$equipo',
                    ventas:'$ventas',
                    imagen_perfil:'$imagen_perfil',
                    listaProductos:'$listaProductos.productos'
            },

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
            
            },{
                $lookup:{
                    from: 'listaproductos',
                    localField: 'productos',
                    foreignField: '_id',
                    as:'listaProductos'
                }
            },
            {
                $project:{
                    nombre:'$nombre',
                    propietario:'$propietario',
                    disponible:'$disponible',
                    productos:'$productos',
                    aniversario:'$aniversario',
                    createdAt:'$createdAt',
                    updatedAt:'$updatedAt',
                    uid:'$uid',
                    horario:'$horario',
                    coordenadas:'$coordenadas',
                    fotografias:'$fotografias',
                    inventario:'$inventario',
                    equipo:'$equipo',
                    direccion:'$direccion',
                    ventas:'$ventas',
                    imagen_perfil:'$imagen_perfil',
                    listaProductos:{
                        $arrayElemAt:['$listaProductos',0]
                    }
                }
            },
            {
                $project:{
                    nombre:'$nombre',
                    propietario:'$propietario',
                    disponible:'$disponible',
                    productos:'$productos',
                    aniversario:'$aniversario',
                    createdAt:'$createdAt',
                    updatedAt:'$updatedAt',
                    uid:'$uid',
                    direccion:'$direccion',
                    horario:'$horario',
                    coordenadas:'$coordenadas',
                    fotografias:'$fotografias',
                    inventario:'$inventario',
                    equipo:'$equipo',
                    imagen_perfil:'$imagen_perfil',
                    ventas:'$ventas',
                    listaProductos:'$listaProductos.productos'
            },

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
                    opciones:'$productos.opciones',

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
                    tienda:'$productos.tienda',
                    
                    opciones:'$productos.opciones',

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
const obtenerProductosTienda = async (req,res)=>{

    const body = req.body;



    const tienda = await ListaProductos.aggregate(
        [
            {
                $match:{
                    '_id':mongoose.Types.ObjectId(body.id)
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
                    '_id':mongoose.Types.ObjectId(body.id)
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


    var productos = await ListaProductos.aggregate(
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

    
    var productosFilter = productos.filter(function(obj){
        return obj.productos.length > 0;
    });

    return res.json({
        ok:true,
        productos:productosFilter[0].productos
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
                    opciones:'$productos.opciones'
                }
            }
        ]
    );

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

const  obtenerTienda = async (req,res = response)=>{


    const usuario = await Usuario.findById(req.uid);

    if(req.body.tienda){

        const tienda = await Tienda.findById(req.body.tienda);

        const productos = await ListaProductos.findById(tienda.productos);

        tienda.listaProductos = productos.productos;

        res.json(   
            tienda
        );

    }else{
        
        const tienda = await Tienda.findById(usuario.negocios[0]);

        const productos = await ListaProductos.findById(tienda.productos);

        tienda.listaProductos = productos.productos;

        res.json(   
            tienda
        );
    }


    
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

module.exports = {crearPedido,busqueda,verTodoProductos,obtenerTienda,obtenerProductosCategoria,verTodoTiendas,nuevaTienda,searchOne,modificarHorarioTienda,modificarAniversario,modificarNombreTienda,modificarStatus,construirPantallaPrincipalCategorias,construirPantallaPrincipalTiendas,construirPantallaPrincipalProductos,obtenerProductosTienda};