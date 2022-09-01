import mongoose from 'mongoose';

const pacienteShema = mongoose.Schema({

    nombre:{
       type:String,
       required:true
    },
    propietario:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true 
    },
    fecha:{
        type:Date,
        required:true,
        default:Date.now()
    },
    sintomas:{
        type:String,
        required:true 
    },

    //Almacenar la referencia del veterinario
    veterinario: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario'
    },
},{
    timestamps:true
});

const Paciente = mongoose.model('Paciente', pacienteShema);
export default Paciente;