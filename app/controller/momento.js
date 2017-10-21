module.exports = function (app) {
   var model = app.model.momento;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbMomento = db.collection("momento");

   var momento = {};

   var versao = "/v1";


   momento.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         var idPersonagem = parseInt(dados.idPersonagem);
         dados.idPersonagem = idPersonagem;
         dbMomento.save(dados)
         .then(val => {
           val._links = [
             {rel : "adicionar", method : "POST", href: "http://" + req.headers.host + versao + "/momentos"},
             {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/momentos/" + val._key},
           ]
           res.status(200).json(val).end()
         }, err => {
           res.status(500).json(err).end()
         })
      }
   };

   momento.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if(result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         var idPersonagem = parseInt(dados.idPersonagem);
         dados.idPersonagem = idPersonagem;
         dbMomento.update(id,dados)
         .then(val => {
           val._links = [
             {rel : "adicionar", method : "POST", href: "http://" + req.headers.host + versao + "/momentos"},
             {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/momentos/" + val._key},
           ]
           res.status(200).json(val).end()
         }, err => {
           res.status(500).json(err).end()
         })
      }
   }






   return momento;
}
