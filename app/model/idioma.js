module.exports = function (app) {
   var Joi = app.get("joi");

   const idioma = {
      _key : Joi.string(),
      idioma : Joi.string().required(),
      descricao : Joi.string().required(),
      lang : Joi.string().required(),
      caminhoImagem : Joi.string()
   };

   return idioma;
}
