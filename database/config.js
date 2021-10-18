const mongoose = require('mongoose');

const dbConnection = async()=>{
    try{
        await mongoose.connect(process.env.DB_CNN,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify: false
        });
        console.log('DB Online')
    }catch(error){
        console.log(console.error);
        throw new Error('Error en la base de datos - Hable con el Admin')
    }
}

module.exports={
    dbConnection
}