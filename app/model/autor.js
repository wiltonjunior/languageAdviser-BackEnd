module.exports = function (app) {
   var Joi = app.get("joi");

   const autor = {
     key : Joi.string(),
     nomeAutor : Joi.string().required(),
     emailAutor : Joi.string().required(),
     senhaAutor : Joi.string().required(),
     sexo : Joi.string().required(),
     telefone : Joi.string().required(),
     pais : Joi.string(),
     estado : Joi.string(),
     cidade : Joi.string(),
     idIdioma : Joi.string().required(),
     caminhoImagem : Joi.string()
   }

   return autor;
}
