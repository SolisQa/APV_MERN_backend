import mongoose from "mongoose";


const conectarDB =  async () =>{

    try{

        const db = await mongoose.connect(process.env.MONGO_URI, {
            
            //Configuracion de mongoose
            useNewUrlParser:true,
            useUnifiedTopology:true
        });

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`Basde de Datos conectada en ${url}`);

    }catch(error){
        console.log(`error: ${error.message}`);
        process.exit(1);
        
    }

};

export default conectarDB;