module.exports = function (app) {
   var Joi = app.get("joi");

   const regiao = {
      tipoRegiao : Joi.string().required(),
      localizacao : Joi.string().required()
   };

   return regiao;
}
