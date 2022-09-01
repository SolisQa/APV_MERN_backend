import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';



import conectarDB from './confg/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';


const app = express();


//Configuracion de las variables de entorno
dotenv.config();

//Leyendo con req.body
app.use(express.json());

//Conexion de la Base de Datos+
conectarDB();

//Configuracion de los Cors
const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
        origin: function (origin, callback) {
                if (dominiosPermitidos.indexOf(origin) !== -1) {
                        //El origen esta permitido
                        callback(null, true);
                } else {
                        callback(new Error('No permitido por CORS'));
                }
        }
}

app.use(cors(corsOptions))



//Agregando mi roputer a mi aplicacion
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

const port = process.env.PORT || 4000;


app.listen(4000, () => {

        console.log(`Aplicacion arrancando el puerto: ${port}`);
});