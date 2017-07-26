module.exports = function (app) {
   var Joi = app.get("joi");

   const idioma = {
      idioma : Joi.string().required(),
      descricao : Joi.string().required(),
      caminhoImagem : Joi.string()
   };

   return idioma;
}
