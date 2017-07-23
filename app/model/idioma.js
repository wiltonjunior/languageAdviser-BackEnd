module.exports = function (app) {
   var Joi = app.get("joi");

   const idioma = {
      lingua : Joi.string().required(),
      caracteristica : Joi.string().required()
   };

   return idioma;
}
