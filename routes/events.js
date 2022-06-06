// Rutas de Usuarios /Auth
// host + /api/events


const {Router} = require('express');
const { check } = require('express-validator');
const { getEvento, crearEvento, actualizarEvento, borrarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();



//Todas deben pasar por la validacion del JWT
router.use(validarJWT);

// Obtener eventos
router.get('/', getEvento);

//Crean un nuevo evento
router.post('/',
    [
        check('tittle', 'El titulo es obligatorio').not().isEmpty(),
        check('starts', 'La fecha de inicio es oligatoria').custom(isDate),
        check('ends', 'La fecha de finalización es oligatoria').custom(isDate),
        validarCampos,
    ] 
,crearEvento);

//Actualizar un nuevo evento
router.put('/:id',
[
    check('tittle', 'El titulo es obligatorio').not().isEmpty(),
    check('starts', 'La fecha de inicio es oligatoria').custom(isDate),
    check('ends', 'La fecha de finalización es oligatoria').custom(isDate),
    validarCampos,
]
, actualizarEvento);

//Borrar un nuevo evento
router.delete('/:id', borrarEvento);



module.exports = router;