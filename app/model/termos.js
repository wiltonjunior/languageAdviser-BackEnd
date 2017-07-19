module.exports = function (app) {
   var Joi = app.get("joi");

   const termos = Joi.object().keys({
      idIdioma : Joi.string().required(),
      palavra : Joi.string().required()
   });

   return termos;
}
