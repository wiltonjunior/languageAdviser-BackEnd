module.exports = function (app) {
   var Joi = app.get("joi");

   const termos = {
      _key : Joi.string(),
      termo : Joi.string().required(),
      idIdioma : Joi.string().required()
   };

   return termos;
}
