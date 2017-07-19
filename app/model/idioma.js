module.exports = function (app) {
   var Joi = app.get("joi");

   const idioma = Joi.object().keys({
      lingua : Joi.string().required(),
      caracteristica : Joi.string().required()
   });

   return idioma;
}
