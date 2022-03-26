const client = require('twilio')(process.env.ACCOUNT_SID,process.env.AUTH_TOKEN);


var controller ={
    twilioTest:function(req,res){
        console.log(process.env.ACCOUNT_SID,process.env.AUTH_TOKEN);
        client.messages.create({
            to:'+524741030509',
            from:'+19034763144',
            body:'Hola mundo'
        }).then(message=> console.log(message.sid)).catch(e=>console.log(e));
        
    },
    enviarSms:function(req,res){
        var body = req.body;
        client
            .verify
            .services(process.env.SERVICE_ID)
            .verifications
            .create({
                to:'+52'+body.to,
                channel:'sms',
                appHash:body.hash
            }).then((data)=>{
                console.log(data);
                res.json(data);
            }).catch((e)=>{
                console.log("erroe"+e);
                return res.status(400).json(e);
            });
    },
    verificarSms:function(req,res){
        var body = req.body;
        client.verify.services(process.env.SERVICE_ID)
        .verificationChecks
        .create({to: '+52'+body.to, code: body.code})
        .then((data)=>{
            console.log(data);
            res.json(data);
        }).catch((e)=>{
            console.log("erroe"+e);
            return res.status(400).json(e);
        });
    }
};

module.exports = controller