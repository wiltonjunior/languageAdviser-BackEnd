module.exports = function (app) {
   var Joi = app.get("joi");

   const contrato = Joi.object().keys({
      dataInicio : Joi.string().required(),
      dataTermino : Joi.string().required(),
      palavraChave : Joi.string().required(),
      idEmpresa : Joi.string().required(),
      idRegiao : Joi.string().required(),
      idTermo : Joi.array().single(),
      idIdioma : Joi.array().single()
   });

   return contrato;
}
