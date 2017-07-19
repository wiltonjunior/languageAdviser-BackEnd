module.exports = function (app) {
   var Joi = app.get("joi");

   const contrato = Joi.object().keys({
      dataInicio : Joi.string(),
      dataTermino : Joi.string(),
      palavraChave : Joi.string(),
      idEmpresa : Joi.string(),
      idTermo : Joi.string(),
      idRegiao : Joi.string(),
      idIdioma : Joi.array().items(Joi.string())
   });

   return contrato;
}
