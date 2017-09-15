module.exports = function (app) {
   var Joi = app.get("joi");

   const nivel = {
      _key : Joi.string(),
      nomeNivel : Joi.string().required(),
      descricao : Joi.string().required(),
      caminhoImagem : Joi.string()
   };

   return nivel;
}
