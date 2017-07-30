module.exports = function (app) {
   var Joi = app.get("joi");

   const licao = {
     _key : Joi.string(),
     nomeLicao : Joi.string().required(),
     texto : Joi.string().required(),
     idAutor : Joi.string().required(),
     idConteudo : Joi.string().required()
   }

   return licao;
}
