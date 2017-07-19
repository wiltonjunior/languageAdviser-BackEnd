module.exports = function (app) {
   var Joi = app.get("joi");

   const conteudo = Joi.object().keys({
      nomeConteudo : Joi.string().required(),
      caracteristica : Joi.string().required(),
      idIdioma : Joi.string().required()
   });

   return conteudo;
}
