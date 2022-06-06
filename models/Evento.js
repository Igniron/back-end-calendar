const {Schema, model} = require('mongoose');

const EventoSchema = Schema({

    tittle: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    starts: {
        type: Date,
        required: true,
    },
    ends: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },

});

EventoSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});


module.exports = model('Evento', EventoSchema);