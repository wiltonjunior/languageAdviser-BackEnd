module.exports = function (app) {
   var Joi = app.get("joi");

   const administrador = {
     _key : Joi.string(),
     nomeAdministrador : Joi.string().required(),
     emailAdministrador : Joi.string().required(),
     senhaAdministrador : Joi.string().required(),
     dataNascimento : Joi.string().required(),
     telefone : Joi.string().required(),
     sexo : Joi.string().required(),
     caminhoImagem : Joi.string(),
     status : Joi.number().integer()
   }

   return administrador;
}
