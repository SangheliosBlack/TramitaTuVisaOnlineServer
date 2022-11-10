const stripe = require('stripe')('sk_test_51IDv5qAJzmt2piZ3A5q7AeIGihRHapcnknl1a5FbjTcqkgVlQDHyRIE7Tlc4BDST6pEKnXlcomoyFVAjeIS2o7SB00OgsOaWqW');
const ListaProductos = require('../models/lista_productos');
const UsuarioVenta = require('../models/usuario_venta');
const Notificacion = require('../notificaciones');
const Direccion = require('../models/direccion');
const haversine = require('haversine-distance')
const Usuario = require('../models/usuario');
const Horario = require('../models/horario');
const Tienda = require('../models/tiendas');
const Pedido = require('../models/pedido');
const Venta = require('../models/venta');
const Ruta = require('../models/rutas');
const mongoose = require('mongoose');
const moment = require('moment');
const Axios = require('axios');

var controller = {

    crearPedido:async (req,res)=>{

        var {total,tarjeta,productos,efectivo,codigo,direccion} = JSON.parse(req.body.cesta);

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
        venta.envio = envio.toFixed(2);
        venta.usuario = usuario;
        venta.servicio = servicio;
        venta.envioPromo = codigo ? envio.toFixed(2) :0;
        venta.direccion = direccion;
        venta.codigo_promo = codigo ? codigo : '';
    
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
    
                    if(datos_tienda.onlin== false){

                        return res.status(400).json({ok:false});

                    }
    
                    var usuarioData = await Usuario.findById({_id:usuario});
                    var usuarioVenta = new UsuarioVenta();
                    var direccion_negocio = new Direccion();
    
                    direccion_negocio.coordenadas = datos_tienda.coordenadas;
                    direccion_negocio.titulo = datos_tienda.direccion;
                    direccion_negocio.predeterminado = false;
                    
                    const a = { latitude: direccion_negocio.coordenadas.latitud, longitude: direccion_negocio.coordenadas.longitud }
                    const b = { latitude: direccion.coordenadas.lat, longitude: direccion.coordenadas.lng}
    
                    var p = 0.017453292519943295;
                    var c = Math.cos;
                    var a2 = 0.5 - c((b.latitude - a.latitude) * p) / 2 + c(a.latitude * p) * c(b.latitude * p) * (1 - c((b.longitude - a.longitude) * p)) / 2;
                    var envioCast = 12745*Math.asin(Math.sqrt(a2));
                    var envioMultiplicado = (envioCast<= 3 ? 19.8 :((envioCast-3)*7.2)+19.8)-0.01;
    
                    usuarioVenta.imagen = 'https://www.blogdelfotografo.com/wp-content/uploads/2020/02/apoyado12-scaled.jpg';
                    usuarioVenta.nombre = usuarioData.nombre;
                    usuarioVenta._id = usuarioData._id;
                        
                    subElement.total = (productos[element].precio + productos[element].extra) * productos[element].cantidad;
                    subElement.tienda = productos[element].tienda;
                    subElement.productos = [productos[element]];
                    subElement.imagen = datos_tienda.imagen_perfil;
                    subElement.punto_venta = datos_tienda.punto_venta;
                    subElement.efectivo = efectivo;
                    subElement.usuario = usuarioVenta;
                    subElement.tiempo_espera = datos_tienda.tiempo_espera;
                    subElement.envio = (envioMultiplicado+8.2).toFixed(2);
                    subElement.direccion_negocio = direccion_negocio;
                    subElement.direccion_cliente = direccion;
                    
                    var rutaR = await Axios.get('https://maps.googleapis.com/maps/api/directions/json',{

                        params:{
                            key:process.env.GOOGLE_DIRECTIONS_API,
                            origin:`${direccion_negocio.coordenadas.latitud},${direccion_negocio.coordenadas.longitud}`,
                            destination:`${direccion.coordenadas.lat},${direccion.coordenadas.lng}`,
                            language:'es-419',
                            region:'mx',
                            mode:'driving'
                        }

                    });
    
                    var ruta = new Ruta();
    
                    ruta.bounds =   rutaR.data.routes[0].bounds;
                    ruta.overview_polyline =   rutaR.data.routes[0].overview_polyline;
                    ruta.distance = rutaR.data.routes[0].legs[0].distance;
                    ruta.duration = rutaR.data.routes[0].legs[0].duration;
    
                    subElement.ruta = ruta;
    
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
        
                pedidosModel.entregado_cliente = false;
                pedidosModel.entregado_repartidor = false;
                pedidosModel.confirmado = false;
                pedidosModel.createdAt = new Date();
                pedidosModel.updatedAt = new Date();

                pedidosModel.repartidor_domicilio = false;
                pedidosModel.repartidor_calificado = false;
    
                pedidosModel.id_venta = venta._id;
                pedidosModel.codigo_repartidor = Math.floor(1000 + Math.random() * 9000);
                pedidosModel.codigo_cliente = Math.floor(1000 + Math.random() * 9000);
    
                pedidosSchema.push(pedidosModel);
            }
            
            venta.pedidos = pedidosSchema;
            
            await venta.save();
    
            await Usuario.findByIdAndUpdate({_id:req.uid},{'cesta.productos':[],'envio_promo':codigo ? true :false});
    
            for(const element in  pedidosSchema){
    
                const data = {
                    tokenId:pedidosSchema[element].punto_venta,
                    titulo:`${pedidosSchema[element].tienda}, tienes un nuevo pedido`,
                    mensaje:'Presionar para mas detalles',
                    evento:'1',
                    pedido:JSON.stringify(pedidosSchema[element])
                };
        
                try{
                    Notificacion.sendPushToOneUser(data);

                    const repartidores = await Usuario.find({transito:false,repartidor:true,online_repartidor:true}).sort( { ultima_tarea: 1 }).limit(1);

                console.log(repartidores);

                if(repartidores.length >0){
                    
                    const data = {
                        tokenId:repartidores[0].tokenFB,
                        titulo:`Tienes un nuevo pedido!`,
                        mensaje:'Presionar para mas detalles',
                        evento:'1',
                        pedido:JSON.stringify(pedidosSchema[element])
                    };

                    try{

                        Notificacion.sendPushToOneUser(data);
    
                    }catch(e){
    
                    
                    }

                }

                    return res.status(200).json(venta);

                }catch(e){
                    
                    return res.status(200).json(venta);
                
                }

                
    
            }
    
            return res.status(200).json(venta);
    
        }else{
    
            const paymentIntent = await stripe.paymentIntents.create({
                amount: total.toFixed(2)*100,
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
        
                        var datos_tienda = await Tienda.findOne({'nombre':productos[element].tienda});
    
                        if(datos_tienda.online == false){
                            return res.status(400).json({ok:false});
                        }
                        
                        var usuarioData = await Usuario.findById({_id:usuario});
                        var usuarioVenta = new UsuarioVenta();
                        var direccion_negocio = new Direccion();
                        
                        direccion_negocio.coordenadas = datos_tienda.coordenadas;
                        direccion_negocio.titulo = datos_tienda.direccion;
                        direccion_negocio.predeterminado = false;
                        
                        const a = { latitude: direccion_negocio.coordenadas.latitud, longitude: direccion_negocio.coordenadas.longitud }
                        const b = { latitude: direccion.coordenadas.lat, longitude: direccion.coordenadas.lng}
    
                        var p = 0.017453292519943295;
                        var c = Math.cos;
                        var a2 = 0.5 - c((b.latitude - a.latitude) * p) / 2 + c(a.latitude * p) * c(b.latitude * p) * (1 - c((b.longitude - a.longitude) * p)) / 2;
                        var envioCast = 12745*Math.asin(Math.sqrt(a2));
                        var envioMultiplicado = (envioCast<= 3 ? 19.8 :((envioCast-3)*7.2)+19.8)-0.01;
    
                        usuarioVenta.imagen = 'https://www.blogdelfotografo.com/wp-content/uploads/2020/02/apoyado12-scaled.jpg';
                        usuarioVenta.nombre = usuarioData.nombre;
                        usuarioVenta._id = usuarioData._id;
                        
                        subElement.total = (productos[element].precio + productos[element].extra) * productos[element].cantidad;
                        subElement.tienda = productos[element].tienda;
                        subElement.productos = [productos[element]];
                        subElement.imagen = datos_tienda.imagen_perfil;
                        subElement.punto_venta = datos_tienda.punto_venta;
                        subElement.efectivo = efectivo;
                        subElement.usuario = usuarioVenta;
                        subElement.tiempo_espera = datos_tienda.tiempo_espera;
                        subElement.envio = (envioMultiplicado+8.2);
                        subElement.direccion_negocio = direccion_negocio;
                        subElement.direccion_cliente = direccion;
                        
                        
                        var rutaR = await Axios.get('https://maps.googleapis.com/maps/api/directions/json',{
                            params:{
                            key:process.env.GOOGLE_DIRECTIONS_API,
                            origin:`${direccion_negocio.coordenadas.latitud},${direccion_negocio.coordenadas.longitud}`,
                            destination:`${direccion.coordenadas.lat},${direccion.coordenadas.lng}`,
                            language:'es-419',
                            region:'mx',
                            mode:'driving'
                            }
                        });
    
                        var ruta = new Ruta();
    
                        ruta.bounds =   rutaR.data.routes[0].bounds;
                        ruta.overview_polyline =   rutaR.data.routes[0].overview_polyline;
                        ruta.distance = rutaR.data.routes[0].legs[0].distance;
                        ruta.duration = rutaR.data.routes[0].legs[0].duration;
    
                        subElement.ruta = ruta;
    
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
            
                    pedidosModel.entregado_cliente = false;
                    pedidosModel.entregado_repartidor = false;
                    pedidosModel.confirmado = false;
                    pedidosModel.createdAt = new Date();
                    pedidosModel.updatedAt = new Date();
                    pedidosModel.repartidor_domicilio = false;
                    pedidosModel.repartidor_calificado = false;
                    pedidosModel.id_venta = venta._id;
                    pedidosModel.codigo_repartidor = Math.floor(1000 + Math.random() * 9000);
                    pedidosModel.codigo_cliente = Math.floor(1000 + Math.random() * 9000);
                    
                    pedidosSchema.push(pedidosModel);
                    
                }
                
                venta.pedidos = pedidosSchema;
                
                await venta.save();
        
                await Usuario.findByIdAndUpdate({_id:req.uid},{'cesta.productos':[],'envio_promo':codigo ? true :false});
                
                for(const element in  pedidosSchema){
    
                    const data = {
                        tokenId:pedidosSchema[element].punto_venta,
                        titulo:`${pedidosSchema[element].tienda}, tienes un nuevo pedido`,
                        mensaje:'Presionar para mas detalles',
                        evento:'1',
                        pedido:JSON.stringify(pedidosSchema[element])
                    };
        
                try{

                    Notificacion.sendPushToOneUser(data);

                    const repartidores = await Usuario.find({transito:false,repartidor:true,online_repartidor:true}).sort( { ultima_tarea: 1 }).limit(1);

                console.log(repartidores);

                if(repartidores.length >0){
                    
                    const data = {
                        tokenId:repartidores[0].tokenFB,
                        titulo:`Tienes un nuevo pedido!`,
                        mensaje:'Presionar para mas detalles',
                        evento:'1',
                        pedido:JSON.stringify(pedidosSchema[element])
                    };


                        Notificacion.sendPushToOneUser(data);
    

                }

                    return res.status(200).json(venta);

                }catch(e){
                    
                    return res.status(200).json(venta);
                
                }

                    return res.status(200).json(venta);

                
                

            }
    
                return res.status(200).json(venta);
        
            }else{
        
                return res.status(400).json({ok:false,msg:paymentIntentConfirm.status});
        
            }
    
        }

    },
    construirPantallaPrincipalTiendas:async (req,res)=>{

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
                        auto_impresion:'$auto_impresion',
                        tiempo_espera:'$tiempo_espera',
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
                        punto_venta:'$punto_venta',
                        imagen_perfil:'$imagen_perfil',
                        sugerencia:"$sugerencia",
                        listaProductos:{
                            $arrayElemAt:['$listaProductos',0]
                        }
                    }
                },
                {
                    $project:{
                        auto_impresion:'$auto_impresion',
                        tiempo_espera:'$tiempo_espera',
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
                        sugerencia:"$sugerencia",
                        punto_venta:'$punto_venta',
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

    },
    busqueda:async(req,res)=>{

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
                        auto_impresion:'$auto_impresion',
                        tiempo_espera:'$tiempo_espera',
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
                        punto_venta:'$punto_venta',
                        sugerencia:"$sugerencia",
                        imagen_perfil:'$imagen_perfil',
                        listaProductos:{
                            $arrayElemAt:['$listaProductos',0]
                        }
                    }
                },
                {
                    $project:{
                        auto_impresion:'$auto_impresion',
                        tiempo_espera:'$tiempo_espera',
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
                        sugerencia:"$sugerencia",
                        punto_venta:'$punto_venta',
                        imagen_perfil:'$imagen_perfil',
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
                        precio:'$productos.precio',
                        nombre:'$productos.nombre',
                        descuentoP:'$productos.descuentoP',
                        descuentoC:'$productos.descuentoC',
                        descripcion:'$productos.descripcion',
                        disponible:'$productos.disponible',
                        categorias:'$productos.categoria',
                        imagen:'$productos.imagen',
                        comentarios:'$productos.comentarios',
                        opciones:'$productos.opciones',
                        tienda:'$productos.tienda',
    
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

    },
    verTodoProductos:async(req,res)=>{

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
                        sugerencia:"$productos.sugerencias",
                        disponible:'$productos.disponible',
                        comentarios:'$productos.comentarios',
                        tienda:'$productos.tienda',
                        subCategoria:'$productos.subCategoria',
                        
                        opciones:'$productos.opciones',
    
                    }
                }
            ]
        );
    
        return res.json({
            ok:true,        
            productos
        });

    },
    verTodoTiendas:async (req,res)=>{

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

    },
    obtenerProductosTienda : async (req,res)=>{

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
                        categorias:{$addToSet:'$productos.subCategoria'}
                    }
                }
            ]
        );
    
        var definitivo =  [];
    
        if(categorias.length > 0){
    
            categorias[0].categorias.forEach(function(currentValue1, index1){
    
                var pre = {};
          
                pre.titulo = currentValue1;
                pre.productos = [];
    
                definitivo.push(pre);
    
                tienda[0].productos.forEach(function(currentValue2, index2){
              
                    if(currentValue1 == currentValue2.subCategoria){
                        
                        definitivo[index1].productos.push(currentValue2);
                
                    }
              
                });
          
            });
      
        }
    
        return res.json(
            {
                ok:true,
                productos:definitivo
            }
        );
    
    },
    construirPantallaPrincipalCategorias : async (req,res)=>{

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
    
    },
    obtenerProductosCategoria : async(req,res)=>{

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
                       },
                       tienda:'$tienda'
                    }
                },{
                    $lookup:{
                        from:'tiendas',
                        localField:'tienda',
                        foreignField:'nombre',
                        as:'tiendas'
                    }
                }
            ]
        );
    
        
        var productosFilter = productos.filter(function(obj){

            return obj.productos.length > 0;

        });
    
        return res.json({
            ok:true,
            productos:productosFilter[0].productos,
            tiendas:productosFilter[0].tiendas
        });

    },construirPantallaPrincipalProductos : async (req,res)=>{

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
                        sugerencia:'$productos.sugerencia',
                        descuentoP:'$productos.descuentoP',
                        descuentoC:'$productos.descuentoC',
                        disponible:'$productos.disponible',
                        comentarios:'$productos.comentarios',
                        tienda:'$productos.tienda',
                        opciones:'$productos.opciones',
                        subCategoria:'$productos.subCategoria'
                    }
                }
            ]
        );
    
        var index = 0;
        var separados = [];
        var contador = 1;
        var limite = 0;

        var shuffledArray = productos.sort(function(){
            return Math.random() - 0.5;
        });

        shuffledArray.splice(15,shuffledArray.length-14);

    
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

            separados[limite].productos.push(shuffledArray[index])
            index++;
            contador ++;
            
        }while(index<shuffledArray.length);
    

            return res.json({
                ok:true,
                separados
            });

        
    
    },
    obtenerTienda : async (req,res)=>{

        const usuario = await Usuario.findOne({_id:req.uid});
    
        if(req.body.token){
    
            var tienda = await Tienda.findOne({punto_venta:req.body.token});
    
            if(tienda){
    
                const productos = await ListaProductos.findById(tienda.productos);
            
                    tienda.listaProductos = productos.productos;
            
                    return res.json(   
                        tienda
                    );
            }else{
    
                if(usuario.negocios.length > 0){
                    
                    const tienda = await Tienda.findById(usuario.negocios[0]);
            
                    const productos = await ListaProductos.findById(tienda.productos);
            
                    tienda.listaProductos = productos.productos;
            
                    return res.json(   
                        tienda
                    );
    
                }else{
    
                    return res.status(400).json({ok:false});
    
                }
    
            }
    
        }else{
    
            if(req.body.tienda){
    
                const tienda = await Tienda.findById(req.body.tienda);
        
                const productos = await ListaProductos.findById(tienda.productos);
        
                tienda.listaProductos = productos.productos;
        
                return res.json(   
                    tienda
                );
        
            }else{
                
                if(usuario.negocios.length > 0){
                    
                    const tienda = await Tienda.findById(usuario.negocios[0]);
            
                    const productos = await ListaProductos.findById(tienda.productos);
            
                    tienda.listaProductos = productos.productos;
            
                    return res.json(   
                        tienda
                    );
    
                }else{
    
                    return res.status(400).json({ok:false});
    
                }
    
            }
        }
    
    },
    confirmarPedidoRestaurante : async (req,res)=>{

        try{

            const value = await Venta.findOneAndUpdate(
                {
                    "_id":mongoose.Types.ObjectId(req.body.uidVenta)
                },{
                    $set:{'pedidos.$[i].confirmado':true,'pedidos.$[i].confirmacion_tiempo':new Date()}
                },{
                    arrayFilters:[
                        {
                            "i._id":mongoose.Types.ObjectId(req.body.uid)
                        }
                    ]
                }
            )
    
            if(value){
    
                return res.status(200).json({ok:true});
    
            }else{
    
                return res.status(400).json({ok:false});
    
            }
        
        }catch(e){
    
            return res.status(400).json({ok:false});
    
        }
    
    },
    confirmarPedidoRepartidor : async(req,res)=>{

        try{

            const value = await Venta.findOneAndUpdate(
                {
                    "_id":mongoose.Types.ObjectId(req.body.uid)
                },{
                    $set:{'pedidos.$[i].entregado_repartidor':true,'pedidos.$[i].entrega_repartidor_tiempo':new Date()}
                },{
                    arrayFilters:[
                        {
                            "i._id":mongoose.Types.ObjectId(req.body.uidVenta)
                        }
                    ]
                }
            )
    
            if(value){
    
                return res.status(200).json({ok:true});
    
            }else{
    
                return res.status(400).json({ok:false});
    
            }

        }catch(e){
    
            return res.status(400).json({ok:false});
    
        }
    
    },
    confirmarPedidoCliente : async(req,res)=>{

        try{

            const value = await Venta.findOneAndUpdate(
                {
                    "_id":mongoose.Types.ObjectId(req.body.uid)
                },{
                    $set:{'pedidos.$[i].entregado_cliente':true,'pedidos.$[i].entrega_cliente_tiempo':new Date()}
                },{
                    arrayFilters:[
                        {
                            "i._id":mongoose.Types.ObjectId(req.body.uidVenta)
                        }
                    ]
                }
            )
    
            if(value){
    
                await Usuario.findByIdAndUpdate(req.uid,{$set:{transito:false,ultima_tarea:new Date()}});
    
                return res.status(200).json({ok:true});
    
            }else{
    
                return res.status(400).json({ok:false});
    
            }

        }catch(e){
    
            return res.status(400).json({ok:false});
    
        }
    
    },
    lista_pedidos : async(req,res)=>{

        const dateP= new Date();
    
        const myDate = moment(dateP).format('L');
    
        var gte = moment(myDate).subtract(0,'hours');
        var lt = moment( myDate).add(1,'days');
    
        var tienda_nombre = await Tienda.findOne({punto_venta:req.body.token});
    
        if(!tienda_nombre){
    
            const usuario = await Usuario.findById({_id:req.uid});
            const tienda = await Tienda.findById(usuario.negocios[0]);
        
            tienda_nombre = {};
            tienda_nombre.nombre = tienda.nombre;
    
        }
    
        if(req.body.tienda){
            const tienda = await Tienda.findById(req.body.tienda);
        
            tienda_nombre = {};
            tienda_nombre.nombre = tienda.nombre;
        }
    
    
        if(req.body.filtro){
    
    
            let text = req.body.filtro;
    
            const myArray = text.split(" - ");
            const horario = [];
    
            myArray.forEach((element) =>{

                const myArray2 = element.split('/');
                horario.push(myArray2);

            });
    
            const gte2 = horario[0][2]+'/'+horario[0][1]+'/'+horario[0][0];
            const lt2 =  horario[1][2]+'/'+horario[1][1]+'/'+horario[1][0];
    
            var gteParse = new Date(gte2);
            var gteSubs = moment(gteParse).subtract(0,'hours');
    
            var ltParse = new Date(lt2);
            var ltSubs = moment(ltParse).add(1,'days');
    
            gte = gteSubs;
            lt = ltSubs;
    
        }
    
        const pedidos = await Venta.aggregate(
            [
            {$match:{}},
            {$unwind:'$pedidos'},
            {$project:{'pedido':'$pedidos'}},
            {$project:{
                "productos": "$pedido.productos",
                "_id": "$pedido._id",
                "total": "$pedido.total",
                "tienda": "$pedido.tienda",
                "repartidor": "$pedido.repartidor",
                "imagen": "$pedido.imagen",
                "ubicacion":"$pedido.ubicacion",
                "direccion":"$pedido.direccion" ,
                "punto_venta":"$pedido.punto_venta" ,
                "efectivo":"$pedido.efectivo" ,
                "usuario":"$pedido.usuario" ,
                "confirmado":"$pedido.confirmado",
                "createdAt":"$pedido.createdAt",
                "updatedAt":"$pedido.updatedAt",
                "tiempo_espera":"$pedido.tiempo_espera",
                "entregado_cliente":"$pedido.entregado_cliente" ,
                "entregado_repartidor":"$pedido.entregado_repartidor",
                "confirmacion_tiempo":"$pedido.confirmacion_tiempo",
                "entrega_repartidor_tiempo":"$pedido.entrega_repartidor_tiempo",
                "entrega_cliente_tiempo":"$pedido.entrega_cliente_tiempo",
                "codigo_repartidor":"$pedido.codigo_repartidor",
                "codigo_cliente":"$pedido.codigo_cliente",
                "id_venta":"$pedido.id_venta",
                "repartidor_domicilio":"$pedido.repartidor_domicilio",
                "repartidor_domicilio_tiempo":"$pedido.repartidor_domicilio_tiempo",
                "repartidor_calificado":"$pedido.repartidor_calificado",
                "repartidor_calificado_tiempo":"$pedido.repartidor_calificado_tiempo",
                "direccion_cliente":'$pedido.direccion_cliente',
                "direccion_negocio":'$pedido.direccion_negocio',
                "envio":'$pedido.envio',
                "ruta":"$pedido.ruta"
            }},
            {
                $match:{
                'tienda': tienda_nombre.nombre,
                'createdAt':{
                    $gte : new Date(gte), 
                    $lt :  new Date(lt), 
                }
            }},
            {
                $lookup:{
                    from:'usuarios',
                    localField:'repartidor',
                    foreignField:'_id',
                    as:'repartidor'
                }
            },
            
            {$project:{
                "productos": "$productos",
                "_id": "$_id",
                "total": "$total",
                "tienda": "$tienda",
                "repartidor": {$arrayElemAt:["$repartidor",0]},
                "imagen": "$imagen",
                "ubicacion":"$ubicacion",
                "direccion":"$direccion" ,
                "punto_venta":"$punto_venta" ,
                "efectivo":"$efectivo" ,
                "usuario":"$usuario" ,
                "confirmado":"$confirmado",
                "createdAt":"$createdAt",
                "updatedAt":"$updatedAt",
                "tiempo_espera":"$tiempo_espera",
                "entregado_cliente":"$entregado_cliente" ,
                "entregado_repartidor":"$entregado_repartidor",
                "confirmacion_tiempo":"$confirmacion_tiempo",
                "entrega_repartidor_tiempo":"$entrega_repartidor_tiempo",
                "entrega_cliente_tiempo":"$entrega_cliente_tiempo",
                "codigo_repartidor":"$codigo_repartidor",
                "codigo_cliente":"$codigo_cliente",
                "id_venta":"$id_venta",
                "repartidor_domicilio":"$repartidor_domicilio",
                "repartidor_domicilio_tiempo":"$repartidor_domicilio_tiempo",
                "repartidor_calificado":"$repartidor_calificado",
                "repartidor_calificado_tiempo":"$repartidor_calificado_tiempo",
                "direccion_cliente":'$direccion_cliente',
                "direccion_negocio":'$direccion_negocio',
                "envio":'$envio',
                "ruta":"$ruta",
                "fix":true
            }},{
                $sort:{
                    "createdAt":-1
                }
            }
            
        ])
    
        function calcularPedidosCompletos( pedidos ){
    
            var completos = 0;
    
            pedidos.forEach(element => element.entregado_repartidor ?  completos++ :completos );
    
            return completos;
            
        }
    
        function calcularGananciaAprox( pedidos ){
    
            var ganancia = 0;
    
            pedidos.forEach(element => ganancia += element.entregado_repartidor ? element.total :0 );
    
            return ganancia;
            
        }
    
        var pedidosPrev = {
            ventas: pedidos,
            size : pedidos.length,
            completados:calcularPedidosCompletos(pedidos),
            ganancia:calcularGananciaAprox(pedidos)
        };
    
        pedidos.forEach(function(element,index){

            if(element.repartidor){
            
                pedidos[index].repartidor.negocios = [];
            
            }

        });
    
        return res.json(pedidosPrev);
    
    },
    modificarNombreTienda : async(req,res)=>{

        await Tienda.findByIdAndUpdate({_id:req.body.tienda},{$set:{nombre:req.body.nombre}});
    
        return res.json({
            ok:true
        });
    
    },
    modificarStatus : async (req,res)=>{
    
        await Tienda.findByIdAndUpdate({_id:req.body.tienda},{$set:{disponible:req.body.disponible}});
    
        return res.json({
            ok:true
        });
    
    },
    modificarAniversario : async(req,res) =>{
    
        await Tienda.findByIdAndUpdate({_id:req.body.tienda},{$set:{aniversario:req.body.aniversario}});
    
        res.json({
            ok:true,
        })
    
    },
    modificarHorarioTienda : async(req,res) =>{
    
        const apertura = moment(req.body.apertura,'hh:mm').format();
        const cierre = moment(req.body.cierre,'hh:mm').format();
    
        var data = {apertura,cierre};
    
        const nuevoHorario = new Horario(data);
    
        await  Tienda.findByIdAndUpdate({_id:req.body.tienda},{$set:{horario:nuevoHorario}});
    
        res.json({
            ok:true,
        });
    },
    searchOne :async (req,res) =>{
        
        const tienda = await Tienda.findOne(req.body.uid);
    
        res.json({ok:true,tienda});

    },
    macChangue : async(req,res)=>{
    
        await Tienda.findByIdAndUpdate({_id:req.body.id},{$set:{'mac':req.body.mac}});
    
        return res.status(200).json({ok:true});
    
    },    
    autoImpresion : async(req,res)=>{
    
        await Tienda.findByIdAndUpdate({_id:req.body.id},{$set:{'auto_impresion':req.body.status}});
    
        return res.status(200).json({ok:true});
    
    },
    nuevaTienda : async (req,res) =>{
    
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
    
    },
    obtenerTiendaMasVendido : async (req,res) =>{

    },
    obtenerProductosMasVendido : async(req,res)=>{
    
    },
    obtenerTiendaPopulares : async (req,res) =>{

    },
    obtenerProductosPopulares : async(req,res)=>{

    }
}

module.exports = controller;






