module.exports = function (app) {
   var Joi = app.get("joi");

   const aluno = {
     _key : Joi.string(),
     nomeAluno : Joi.string().required(),
     emailAluno : Joi.string().required(),
     senhaAluno : Joi.string().required(),
     sexo : Joi.string().required(),
     telefone : Joi.string().required(),
     pais : Joi.string(),
     estado : Joi.string(),
     cidade : Joi.string(),
     caminhoImagem : Joi.string(),
     status : Joi.number().integer()
   }

   return aluno;
}
