const client = require('twilio')(process.env.ACCOUNT_SID,process.env.AUTH_TOKEN);


var controller ={
    twilioTest:function(req,res){
        client.messages.create({
            to:'+524741030509',
            from:'+19034763144',
            body:'Hola mundo'
        }).then(message=> console.log(message.sid)).catch(e=>console.log(e));
        
    },
    enviarSms:function(req,res){

        var body = req.body;

        if(body.hash){
            client
            .verify
            .services(process.env.SERVICE_ID)
            .verifications
            .create({
                to:body.codigo+body.to,
                channel:'sms',
                appHash:body.hash
            }).then((data)=>{
                res.json(data);
            }).catch((e)=>{
                
                return res.status(400).json(e);
            });
        }else{
            client
            .verify
            .services(process.env.SERVICE_ID)
            .verifications
            .create({
                to:body.codigo+body.to,
                channel:'sms',
            }).then((data)=>{
                res.json(data);
            }).catch((e)=>{
                
                return res.status(400).json(e);
            });
        }
        
    },
    verificarSms:function(req,res){
        var body = req.body;
        client.verify.services(process.env.SERVICE_ID)
        .verificationChecks
        .create({to: body.codigo+body.to, code: body.code})
        .then((data)=>{
            res.json(data);
        }).catch((e)=>{
            return res.status(400).json(e);
        });
    }
};

module.exports = controller