module.exports = function (app) {
   var Joi = app.get("joi");

   const estudo = {
     _Key : Joi.string(),
     idIdioma : Joi.array().single().required()
   }


   return estudo;
}
