module.exports = function (app) {
   var Joi = app.get("joi");

   const empresa = {
      _key : Joi.string(),
      nomeEmpresa : Joi.string().required(),
      telefone : Joi.string().required(),
      email : Joi.string(),
      cidade : Joi.string().required(),
      estado : Joi.string().required(),
      pais : Joi.string().required()
   };

   return empresa;
}
