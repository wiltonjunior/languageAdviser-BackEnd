module.exports = function (app) {
   var Joi = app.get("joi");

   const aluno = {
     nomeAluno : Joi.string().required(),
     emailAluno : Joi.string().required(),
     senhaAluno : Joi.string().required(),
     sexo : Joi.string().required(),
     telefone : Joi.string().required(),
     pais : Joi.string(),
     estado : Joi.string(),
     cidade : Joi.string(),
     caminhoImagem : Joi.string()
   }

   return aluno;
}
