module.exports = function (app) {
   var Joi = app.get("joi");

   const termos = {
      termo : Joi.string().required(),
      termoTraducao : Joi.string().required()
   };

   return termos;
}
