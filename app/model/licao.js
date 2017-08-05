module.exports = function (app) {
   var Joi = app.get("joi");

   const licao = {
     _key : Joi.string(),
     nomeLicao : Joi.string().required(),
     descricao : Joi.string().required(),
     data : Joi.string(),
     idAutor : Joi.string().required(),
     idConteudo : Joi.string().required()
   }

   return licao;
}
