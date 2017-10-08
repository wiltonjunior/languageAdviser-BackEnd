module.exports = function (app) {
   var Joi = app.get("joi");

   const usuario = {
     _key : Joi.string(),
     nomeUsuario : Joi.string().required(),
     emailUsuario : Joi.string().required(),
     senhaUsuario : Joi.string().required(),
     telefone : Joi.string().required(),
     sexo : Joi.string().required(),
     pais : Joi.string().required(),
     estado : Joi.string().required(),
     cidade : Joi.string().required(),
     caminhoImagem : Joi.string(),
     status : Joi.number().integer()
   }

   return usuario;
}
