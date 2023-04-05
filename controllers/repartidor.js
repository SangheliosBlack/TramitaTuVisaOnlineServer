const Venta = require('../models/venta');
const mongoose = require('mongoose');
const moment = require('moment');
const Usuario = require('../models/usuario');

var controller = {
    desconectar :async function (req,res){

        await Usuario.findByIdAndUpdate({_id:req.body.uid},{$set:{'online_repartidor':false}});

        return res.status(200).json({ok:true});

    },
    conectar :async function (req,res){

        await Usuario.findByIdAndUpdate({_id:req.body.uid},{$set:{'online_repartidor':true}});

        return res.status(200).json({ok:true});


    },
    transitoUsuario: async function(req,res){
        try {
            await Usuario.findByIdAndUpdate({_id:req.body.id},{$set:{'transito':true}});
            return res.status(200).json({ok:true});
        } catch (error) {
            return res.status(400).json({ok:false});
            
        }
    },
    transitoUsuarioOff: async function(req,res){
        try {
            await Usuario.findByIdAndUpdate({_id:req.body.id},{$set:{'transito':false}});
            return res.status(200).json({ok:true});
        } catch (error) {
            return res.status(400).json({ok:false});
            
        }
    },
    buscarEnvioPendiente: async function(req,res){

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
                
                
                "punto_venta":"$pedido.punto_venta" ,
                "efectivo":"$pedido.efectivo" ,
                "usuario":"$pedido.usuario" ,
                "pagado":"$pedido.pagado" ,
                "preparado":"$pedido.preparado" ,
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
                "envio":"$pedido.envio",
                "ruta":"$pedido.ruta",
                
            }},
            {
                $match:{
                entregado_cliente:false,
                repartidor:mongoose.Types.ObjectId('6246598565e106410cf6bb4a'),
            }},
            {$project:{
                "productos": "$productos",
                "_id": "$_id",
                "total": "$total",
                "tienda": "$tienda",
                "imagen": "$imagen",
                "punto_venta":"$punto_venta" ,
                "efectivo":"$efectivo" ,
                "usuario":"$usuario" ,
                "pagado":"$pagado" ,
                "preparado":"$preparado" ,
                "confirmado":"$confirmado",
                "createdAt":"$createdAt",
                "updatedAt":"$updatedAt",
                "tiempo_espera":"$tiempo_espera",
                "entregado_cliente":   "$entregado_cliente" ,
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
                "envio":"$envio",
                "ruta":"$ruta",
            }}
            
        ])
        

        return res.json(pedidos);

    },
    confirmarPedidoEntregado: async function(req,res){

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
                
                
                "punto_venta":"$pedido.punto_venta" ,
                "efectivo":"$pedido.efectivo" ,
                "usuario":"$pedido.usuario" ,
                "pagado":"$pedido.pagado" ,
                "preparado":"$pedido.preparado" ,
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
                "envio":"$pedido.envio",
                "ruta":"$pedido.ruta",
                
            }},
            {
                $match:{
                _id:mongoose.Types.ObjectId(req.body.id),
                entregado_repartidor:false
            }},
            {$project:{
                "productos": "$productos",
                "_id": "$_id",
                "total": "$total",
                "tienda": "$tienda",
                "imagen": "$imagen",
                "punto_venta":"$punto_venta" ,
                "efectivo":"$efectivo" ,
                "usuario":"$usuario" ,
                "pagado":"$pagado" ,
                "preparado":"$preparado" ,
                "confirmado":"$confirmado",
                "createdAt":"$createdAt",
                "updatedAt":"$updatedAt",
                "tiempo_espera":"$tiempo_espera",
                "entregado_cliente":   "$entregado_cliente" ,
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
                "envio":"$envio",
                "ruta":"$ruta",
            }}
            
        ])
        
        if(pedidos.length == 0 ){

            return res.status(200).json({ok:true});

        }else{
            
            return res.status(400).json({ok:false});
            
        }


    },
    obtenerEnviosMomento: async function(req,res){

        const dateP= new Date();

        const myDate = moment(dateP).format('L');

        var gte = moment(myDate).subtract(0,'hours');
        var lt = moment( myDate).add(1,'days');

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
                
                
                "punto_venta":"$pedido.punto_venta" ,
                "efectivo":"$pedido.efectivo" ,
                "usuario":"$pedido.usuario" ,
                "pagado":"$pedido.pagado" ,
                "preparado":"$pedido.preparado" ,
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
                "envio":"$pedido.envio",
                "ruta":"$pedido.ruta",

                
            }},
            {
                $match:{
                'tienda':'Capitan Naza',
                'createdAt':{
                    $gte : new Date(gte), 
                    $lt :  new Date(lt), 
                },
                repartidor:mongoose.Types.ObjectId(req.uid),
            }},
            {$project:{
                "productos": "$productos",
                "_id": "$_id",
                "total": "$total",
                "tienda": "$tienda",
                "imagen": "$imagen",
                "punto_venta":"$punto_venta" ,
                "efectivo":"$efectivo" ,
                "usuario":"$usuario" ,
                "pagado":"$pagado" ,
                "preparado":"$preparado" ,
                "confirmado":"$confirmado",
                "createdAt":"$createdAt",
                "updatedAt":"$updatedAt",
                "tiempo_espera":"$tiempo_espera",
                "entregado_cliente":   "$entregado_cliente" ,
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
                "envio":"$envio",
                "ruta":"$ruta",
            }},{
                $sort:{
                    "createdAt":-1
                }
            }
            
        ])


        console.log(pedidos);
        console.log('pedidos');
        

        return res.json(pedidos);

    },
    obtenerEnvios:async function(req,res){
        

        const dateP= new Date();

        const myDate = moment(dateP).format('L');

        var gte = moment(myDate).subtract(0,'hours');
        var lt = moment( myDate).add(1,'days');

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
                
                
                "punto_venta":"$pedido.punto_venta" ,
                "efectivo":"$pedido.efectivo" ,
                "usuario":"$pedido.usuario" ,
                "pagado":"$pedido.pagado" ,
                "preparado":"$pedido.preparado" ,
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
                "envio":"$pedido.envio",
                "ruta":"$pedido.ruta",
                
            }},
            {
                $match:{
                'createdAt':{
                    $gte : new Date(gte), 
                    $lt :  new Date(lt), 
                },
                repartidor:mongoose.Types.ObjectId(req.uid),
            }},
            {$project:{
                "productos": "$productos",
                "_id": "$_id",
                "total": "$total",
                "tienda": "$tienda",
                "imagen": "$imagen",
                "punto_venta":"$punto_venta" ,
                "efectivo":"$efectivo" ,
                "usuario":"$usuario" ,
                "pagado":"$pagado" ,
                "preparado":"$preparado" ,
                "confirmado":"$confirmado",
                "createdAt":"$createdAt",
                "updatedAt":"$updatedAt",
                "tiempo_espera":"$tiempo_espera",
                "entregado_cliente":   "$entregado_cliente" ,
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
                "envio":"$envio",
                "ruta":"$ruta",
                "abonos":[]
            }},{
                $sort:{
                    "createdAt":-1
                }
            }
            
        ])
        function calcularGananciaAprox( pedidos ){

            var ganancia = 0;
    
            pedidos.forEach(element => ganancia += element.entregado_cliente ? element.envio :0 );
    
    
            return ganancia;
            
        }

        var global = {
            ventas:pedidos,
            size:0,
            completados:0,
            
            ganancia:calcularGananciaAprox(pedidos)
        }
        

        return res.json(global);
    }

}

module.exports =  controller;