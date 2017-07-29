module.exports = function (app) {
   var Joi = app.get("joi");

   const termos = {
      key : Joi.string(),
      termo : Joi.string().required(),
      termoTraducao : Joi.string().required()
   };

   return termos;
}
