const Joi = require('joi');

const filmShema = Joi.object().keys({
    date: Joi.date().raw().error(() => "date error"),
    text: Joi.string().trim().max(40).required(),
    iduser: Joi.number().required(),
    done: Joi.bool().required()
});

module.exports = filmShema;