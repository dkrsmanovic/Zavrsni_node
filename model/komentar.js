const Joi = require('joi');

const komentarShema = Joi.object().keys({
    date: Joi.date().raw().error(() => "date error"),
    text: Joi.string().trim().min(1).max(1000).required(),
    iduser: Joi.number().required()
});

module.exports = komentarShema;