module.exports = function (app) {
   var Joi = app.get("joi");

   const contrato = {
      _key : Joi.string(),
      dataInicio : Joi.date().required(),
      dataTermino : Joi.date().required(),
      palavraChave : Joi.string().required(),
      idEmpresa : Joi.string().required(),
      idRegiao : Joi.string().required(),
      idTermo : Joi.array().single()
   };

   return contrato;
}
