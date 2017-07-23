module.exports = function (app) {
   var Joi = app.get("joi");

   const termos = {
      termo : Joi.string().required(),
      termoReferente : Joi.array().single()
   };

   return termos;
}
