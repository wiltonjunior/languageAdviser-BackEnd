module.exports = function (app) {
    var Joi = app.get("joi");

    const momento = {
      _key : Joi.string(),
      ordem : Joi.string().required(),
      idPersonagem : Joi.number().integer().required(),
      textoNativo : Joi.string().required(),
      textoTraduzido : Joi.string().required(),
      idDialogo : Joi.string().required()
    }


    return momento;
}
