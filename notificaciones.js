const admin = require('firebase-admin');

function initFirebase(){

    const serviceAccount = require(__dirname+'/keys/flluter-push-notifications-firebase-adminsdk-u73rq-a52993a80b.json');
    admin.initializeApp({
        credential:admin.credential.cert(serviceAccount)
    });

}

initFirebase();

function sendPushToOneUser(mensaje){

    const message = {
        token:mensaje.tokenId,
        data:{
            title:mensaje.titulo,
            body:mensaje.mensaje
        },
        notification:{
            title:'Notification APP',
            body:'{Message from node js app}'
        },
        android:{
            ttl: 2419200,
            priority: "high",
            notification:{
                channel_id: "general_id",
                imageUrl:'https://i.blogs.es/fff4ca/pizzas/1366_2000.jpg',
            }
        }
    }

    sendMessage(message);
}

module.exports = {sendPushToOneUser};

function sendMessage(message){
    admin.messaging().send(message)
    .then((response)=>{
        console.log('Successfully sent message',response);
    }).catch((error)=>{
        console.log('Error sending message',error);
    });
}
