const { response } = require('express');
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

const createNewCustomer = async (req,res = response) =>{

    console.log(req.body.paymentMethod);
    const usuario = await Usuario.findById(req.uid);

    if(usuario.customerID){
        
        const paymentMethodAttach = await stripe.paymentMethods.attach(
            req.body.paymentMethod,
            {customer: usuario.customerID}
        );

            console.log(paymentMethodAttach);

        res.json(
            paymentMethodAttach
        );

    }else{
        const customer = await stripe.customers.create({
            description: 'Cliente generado con el ID : '+req.uid,
            email:usuario.email,
            name:usuario.name
        });
    
    
        const paymentMethodAttach = await stripe.paymentMethods.attach(
            req.body.paymentMethod,
            {customer: customer.id}
        );
    
    
        await Usuario.findOneAndUpdate({'_id':req.uid},{'$set':{'customerID':customer.id}});
    
        res.json({
            paymentMethodAttach
        });
    }


    
}

module.exports = {getListCustomerPaymentsMethods,createNewCustomer};