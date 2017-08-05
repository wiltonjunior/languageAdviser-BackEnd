module.exports = function (app) {
   var Joi = app.get("joi");

   const dialogo = {
      _key : Joi.string(),
      texto : Joi.string().required(),
      idLicao : Joi.string()
   }

   return dialogo;
}
