module.exports = function (app) {
   var Joi = app.get("joi");

   const licao = {
     texto : Joi.string().required(),
     idAutor : Joi.string().required()
   }
}
