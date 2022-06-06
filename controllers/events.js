const { response } = require("express")
const Evento = require("../models/Evento")


const getEvento = async(req, res = response)=>
{
    const eventos = await Evento.find().populate('user', 'name');

    res.json({
        ok: true,
        eventos,
    })
}

const crearEvento = async(req, res = response)=>
{
    const evento = new Evento(req.body);

    try 
    {
        evento.user = req.uid;

        const eventoGuardado = await evento.save()
        res.status(201).json({
            ok: true,
            evento: eventoGuardado,
            msg: 'Eventro creado correctamente',
        })
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear evento, comuniquese con un administrador',
        });
    }

    res.json({
        ok: true,
        msg: 'crearEvento',
    })
}

const actualizarEvento = async(req, res = response)=>
{
    const eventoId = req.params.id;
    const uid = req.uid;
    try 
    {
        const evento = await Evento.findById(eventoId);

        if (!evento)
        {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existente',
            });
        }

        if (evento.user.toString() !== uid)
        {
            return res.status(401).json ({
                ok: false,
                msg: 'No tiene los permisos para modificar el evento',
            });
        }
        const nuevoEvento = {
            ...req.body,
            user: uid,
        };
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true});
        res.status(201).json({
            ok: true,
            eventoActualizado,
            msg: 'El evento se actualizó correctamente',
        });
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar evento, hable con un adminsitrador',
        });
    }

}

const borrarEvento = async(req, res = response)=>
{
    const eventoId = req.params.id;
    const uid = req.uid;
    try 
    {
        const evento = await Evento.findById(eventoId);

        if (!evento)
        {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existente',
            });
        }

        if (evento.user.toString() !== uid)
        {
            return res.status(401).json ({
                ok: false,
                msg: 'No tiene los permisos para modificar el evento',
            });
        }
        
        await Evento.findByIdAndDelete(eventoId);
        res.status(201).json({
            ok: true,
            msg: 'El evento se eliminó correctamente',
        });
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar evento, hable con un adminsitrador',
        });
    }
}

module.exports= {
    getEvento,
    crearEvento,
    actualizarEvento,
    borrarEvento,
}
