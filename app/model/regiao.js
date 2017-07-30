module.exports = function (app) {
   var Joi = app.get("joi");

   const regiao = {
      _key : Joi.string(),
      tipoRegiao : Joi.string().required(),
      localizacao : Joi.string().required()
   };

   return regiao;
}
