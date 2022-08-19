const Venta = require('../models/venta');
const mongoose = require('mongoose');
const moment = require('moment');

var controller = {

    obtenerEnvio:async function(req,res){

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
                "ubicacion":"$pedido.ubicacion",
                "direccion":"$pedido.direccion" ,
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
                
            }},
            {
                $match:{
                'tienda':'Capitan Naza',
                'createdAt':{
                    $gte : new Date(gte), 
                    $lt :  new Date(lt), 
                },
                repartidor:mongoose.Types.ObjectId('6246598565e106410cf6bb4a'),
            }},
            {$project:{
                "productos": "$productos",
                "_id": "$_id",
                "total": "$total",
                "tienda": "$tienda",
                "repartidor": '$repartidor',
                "imagen": "$imagen",
                "ubicacion":"$ubicacion",
                "direccion":"$direccion" ,
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
            }},{
                $sort:{
                    "createdAt":-1
                }
            }
            
        ])

        return res.json(pedidos);
    }

}

module.exports =  controller;