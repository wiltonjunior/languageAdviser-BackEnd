module.exports = function (app) {
   var Joi = app.get("joi");

   const licao = {
     key : Joi.string(),
     nomeLicao : Joi.string().required(),
     texto : Joi.string().required(),
     idAutor : Joi.string().required()
   }
}
