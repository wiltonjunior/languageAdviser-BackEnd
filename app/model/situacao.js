module.exports = function (app) {
   var Joi = app.get("joi");

   const situacao = {
     _key : Joi.string(),
     nomeSituacao : Joi.string().required(),
     descricao : Joi.string().required(),
     grupo : Joi.string().required()
   }

   return situacao;
}
