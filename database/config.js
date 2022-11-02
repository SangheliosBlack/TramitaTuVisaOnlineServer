const mongoose = require('mongoose');

const dbConnection = async()=>{
    
    try{
        mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    
        console.log('Base de datos conectada');

    }catch(error){
        
        console.log(error);
        throw new Error('Error en la base de datos - Hable con el Admin');

    }
}

module.exports={

    dbConnection
    
}