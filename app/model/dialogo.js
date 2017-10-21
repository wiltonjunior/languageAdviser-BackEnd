module.exports = function (app) {
   var Joi = app.get("joi");

   const personagem = Joi.object().keys({
     idPersonagem : Joi.number().integer(),
     nomePersonagem : Joi.string().required(),
     tomVoz : Joi.string().required()
   });

   const dialogo = {
      _key : Joi.string(),
      nomeDialogo : Joi.string().required(),
      personagem : Joi.array().items(personagem).single(),
      idLicao : Joi.string()
   }

   return dialogo;
}
