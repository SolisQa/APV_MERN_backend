import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarId.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';


//Esta funcion me permite registrar un Veterinario
const registrar = async (req, res) => {

    //Prevenir usuarios duplicados
    const { email, nombre } = req.body;

    const existeUsuario = await Veterinario.findOne({ email });
    if (existeUsuario) {
        const error = new Error('Usuario ya Registrado');
        return res.status(400).json({ msg: error.message })
    }

    try {
        const veterinario = Veterinario(req.body);
        const vetrianrioGuardado = await veterinario.save();

        //Enviar el Email
        emailRegistro({
            email,
            nombre,
            token: vetrianrioGuardado.token
        })

        res.json(vetrianrioGuardado);

    } catch (error) {
        console.log(error);
    }

};


//Confirma si el usuario existe en la Base de Datoas
const confirmar = async (req, res) => {

    const { token } = req.params;
    const usuarioConfirmar = await Veterinario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(400).json({ msg: error.message });

    }
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({ msg: "Usuario Confirmado Correctamente" });
    } catch (error) {
        console.log(error);
    }


};

//Funcion que me permite autenticar el usuario
const autenticar = async (req, res) => {

    //Comprobar si el usuario existe
    const { email, password } = req.body;
    const usuario = await Veterinario.findOne({ email });
    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    //Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu Cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    if (await usuario.comprobarPassword(password)) {
        //Autenticar // Me permite cerrar sesion y ingresar a mi perfil directamente sin el flash 
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),

        });

    } else {
        const error = new Error('El Password es Incorrecto');
        return res.status(404).json({ msg: error.message });
    }


}


//Esta funcion obtiene el perfil
const perfil = (req, res) => {

    const { veterinario } = req;

    res.json(veterinario);

};

const olvidePassword = async (req, res) => {

    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({ email });
    if (!existeVeterinario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    //En caso de que el correo si este bien
    try {

        existeVeterinario.token = generarId()
        await existeVeterinario.save()

        //Enviar email
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token


        });

        res.json({ msg: 'Hemos enviado un email con las instrucciones' })

    } catch (error) {
        console.log(error);
    }
}
const comprobarToken = async (req, res) => {

    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token });
    if (tokenValido) {
        res.json({ msg: 'Token Valido y el usuario existe' })
    } else {
        const error = new Error("Token no valido");
        return res.status(400).json({ msg: error.message });
    }
}



const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }

    try {

        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();

        res.json({ msg: "Password Modificado Correctamente" })
        console.log(veterinario)

    } catch (error) {
        console.log(error);
    }

}

const actualizarPerfil = async (req, res) => {

    const veterinario = await Veterinario.findById(req.params.id);
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body;
    if (veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email });
        if (existeEmail) {
            const error = new Error('Email ya esta en uso');
            return res.status(400).json({ msg: error.message });
        }
    }


    //Actualiza los datos de mi DB
    try {

        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;


        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);

    } catch (error) {

        console.log(error);
    }

}

const actualizarPassword = async (req, res) => {

    //Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    //Comprobar el veterinario exista
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message })
    }

    //Comprobar el password
    if (await veterinario.comprobarPassword(pwd_actual)) {
        veterinario.password = pwd_nuevo;

        await veterinario.save();
        res.json({msg: "Password almacenado correctamente"});

    } else {
        const error = new Error('El Password Actual es Incorrecto');
        return res.status(400).json({ msg: error.message });
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    nuevoPassword,
    comprobarToken,
    actualizarPerfil,
    actualizarPassword
}