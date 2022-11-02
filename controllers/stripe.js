const stripe = require('stripe')('sk_test_51IDv5qAJzmt2piZ3A5q7AeIGihRHapcnknl1a5FbjTcqkgVlQDHyRIE7Tlc4BDST6pEKnXlcomoyFVAjeIS2o7SB00OgsOaWqW');
const { response, json } = require('express');
const Usuario = require('../models/usuario');

var controller = {

    getListCustomerPaymentsMethods : async (req,res = response) =>{

        const usuario = await Usuario.findById(req.uid);
    
        const paymentMethods = await stripe.paymentMethods.list({
            customer: usuario.customer_id,
            type: 'card',
        });
    
        res.json({
            paymentMethods
        });

    }, 
    deletePaymethMethod : async (req,res)=>{
    
        try {
    
            await stripe.paymentMethods.detach(
                req.body.paymentMethodID
            );
    
            return res.status(200).json({ok:true});
    
        }catch (error) {
    
            return res.status(400).json({ok:false});
    
        }
    
    },
    obtenerCliente : async(req,res)=>{
    
        const usuario = await Usuario.findById(req.uid);
    
        const customer = await stripe.customers.retrieve(
            usuario.customer_id
        );
    
        return res.json(customer);

    },
    updateCustomerPaymethDefault : async(req,res)=>{
    
        try {
            
            await stripe.customers.update(
                req.body.customer_id,
                {invoice_settings: {default_payment_method: req.body.paymentMethodID}}
            );
    
            return res.status(200).json({ok:true});
    
        } catch (error) {
            
            return res.status(400).json({ok:false});
    
        }
    
    },
    createPaymentMethod : async(req,res = response)=>{
    
        const data = req.body;
    
        const usuario = await Usuario.findById(req.uid);
    
        try{
    
            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                  number:data.card,
                  exp_month: data.cardExpMonth,
                  exp_year: data.cardExpYear,
                  cvc: data.cardCvc,
                },
            });
    
            if(usuario.customer_id){
            
                const paymentMethodAttach = await stripe.paymentMethods.attach(
                    paymentMethod.id,
                    {customer: usuario.customer_id}
                );
        
                res.status(200).json(
                    paymentMethodAttach
                );
    
            }else{
        
                const customer = await stripe.customers.create({
                    description: 'Cliente generado con el ID : '+req.uid,
                    email:usuario.correo,
                    name:usuario.nombre
                });
            
                const paymentMethodAttach = await stripe.paymentMethods.attach(
                    paymentMethod.id,
                    {customer: customer.id}
                );
            
                await Usuario.findOneAndUpdate({'_id':req.uid},{'$set':{'customer_id':customer.id}});
    
                res.status(200).json(
                    paymentMethodAttach
                );
                
            }
    
        }catch(error){

            return res.status(402).json({ok:false});
    
        }
    
    }

}



module.exports = controller;