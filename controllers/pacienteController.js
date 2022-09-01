import Paciente from '../models/Paciente.js';


//Agrega un Paciente
const agregarPaciente = async(req, res) =>{
    
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;

    try{
        //Almacenar en la Base de Datos
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);

    }catch(error){
        console.log(error);
    }
}


//Obtiene los pacientes del veterinario
const obtenerPacientes = async(req, res) =>{

    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
    res.json(pacientes)
}


//Obtiene un Paciente en Especifico
const obtenerPaciente = async(req, res) =>{

    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: 'No encontrado.'});
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Accion no valida"});
    }

        //Mostramos el Paciente
        res.json(paciente);
    

}

//Actualizamos el Paciente
const actualizarPaciente= async(req, res) =>{
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: 'No encontrado.'});
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Accion no valida"});
    }
    //Actualzamos el Paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    //Guardamos en la Base de datos
    try{

        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);

    }catch(error){
        console.log(error);
    }
} 

    
 

const eliminarPaciente = async(req, res) =>{
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: 'No encontrado.'});
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Accion no valida"});
    }

    //Eliminar el registro

    try{

        await paciente.deleteOne();
        res.json({msg: 'Paciente Eliminado'})
        
    }catch(error){
        console.log(error);
    }
}


export {
    agregarPaciente, 
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}