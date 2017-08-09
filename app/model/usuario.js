module.exports = function (app) {
   var Joi = app.get("joi");

   const usuario = {
      _key : Joi.string().required(),
      idIdioma : Joi.array().single().required()
   }

   return usuario;
}
