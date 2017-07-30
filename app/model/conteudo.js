module.exports = function (app) {
   var Joi = app.get("joi");

   const conteudo = {
      _key : Joi.string(),
      nomeConteudo : Joi.string().required(),
      descricao : Joi.string().required(),
      idIdioma : Joi.string().required()
   };

   return conteudo;
}
