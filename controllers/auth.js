const bcrypt = require('bcryptjs/dist/bcrypt');
const {response} = require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/Usuario');

const crearUsuario = async(req, res = response)=>
{
    const {email, password} = req.body;
    try 
    {
        let usuario = await Usuario.findOne({email});
        
        if(usuario)
        {
            return res.status(400).json({
                ok:false,
                msg: 'El usuario ya existe con ese correo',
            });
        }

        usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt  = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            udi: usuario.id,
            name: usuario.name,
            token,
            msg: 'registrado',
        })
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
    
}

const loginUsuario = async(req, res = response)=>
{
    

    const {email, password} = req.body;

    try 
    {
        const usuario = await Usuario.findOne({email});
        
        if(!usuario)
        {
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no existe con ese email',
            });
        }  

        // Confirmar las contraseñas
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword)
        {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecta',
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
            msg: 'Logeado correctamente',
        })

    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}

const renewToken = async(req, res = response)=>
{
    const {uid, name} = req;

    // generar un nuevo JTW y retornarlo en esta peticion
    const token = await generarJWT(uid, name);
        
    res.status(201).json({
        ok: true,
        uid,
        name,
        token,
        msg: 'Token renovado',
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken,
};