const { response, json } = require('express');
const { body: data } = require('express-validator');
const Usuario = require('../models/usuario');

const stripe = require('stripe')('sk_test_51IDv5qAJzmt2piZ3A5q7AeIGihRHapcnknl1a5FbjTcqkgVlQDHyRIE7Tlc4BDST6pEKnXlcomoyFVAjeIS2o7SB00OgsOaWqW');

const getListCustomerPaymentsMethods = async (req,res = response) =>{

    const usuario = await Usuario.findById(req.uid);

    const paymentMethods = await stripe.paymentMethods.list({
        customer: usuario.customerID,
        type: 'card',
    });
    res.json({
        paymentMethods
    })
}

const createPaymentMethod = async(req,res = response)=>{

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

        if(usuario.customerID){
        
            const paymentMethodAttach = await stripe.paymentMethods.attach(
                paymentMethod.id,
                {customer: usuario.customerID}
            );
    
            res.status(200).json(res.status(200).json(
                paymentMethodAttach
            ));
    
        }else{
    
            const customer = await stripe.customers.create({
                description: 'Cliente generado con el ID : '+req.uid,
            });
        
            const paymentMethodAttach = await stripe.paymentMethods.attach(
                req.body.paymentMethod,
                {customer: customer.id}
            );
        
            await Usuario.findOneAndUpdate({'_id':req.uid},{'$set':{'customerID':customer.id}});
        
            res.status(200).json(
                paymentMethodAttach
            );

        }

    }catch(error){
        console.log(error);
        return res.status(402).json(res.status(200).json(
            paymentMethodAttach
        ));

    }

}



module.exports = {getListCustomerPaymentsMethods,createPaymentMethod};