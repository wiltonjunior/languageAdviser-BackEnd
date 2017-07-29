module.exports = function (app) {
   var Joi = app.get("joi");

   const conteudo = {
      key : Joi.string(),
      nomeConteudo : Joi.string().required(),
      descricao : Joi.string().required(),
      idIdioma : Joi.string().required()
   };

   return conteudo;
}
