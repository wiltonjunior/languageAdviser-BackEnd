module.exports = function (app) {
   var Joi = app.get("joi");

   const termos = Joi.object().keys({
      idIdioma : Joi.string(),
      palavra : Joi.string(),
      palavraRelacionadas : Joi.array().items(Joi.string())
   });

   return termos;
}
