module.exports = function (app) {
   var Joi = app.get("joi");

   const licao = {
     _key : Joi.string(),
     nomeLicao : Joi.string().required(),
     descricao : Joi.string().required(),
     data : Joi.string(),
     avaliacao : Joi.number().integer(),
     quantidadeVotos : Joi.number().integer(),
     idUsuario : Joi.string().required(),
     idIdioma : Joi.string().required(),
     idNivel : Joi.string().required(),
     idSituacao : Joi.string().required()
   }

   return licao;
}
