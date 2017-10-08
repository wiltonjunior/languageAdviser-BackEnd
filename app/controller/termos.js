module.exports = function (app) {
   var model = app.model.termos;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbTermo = db.collection("termos");

   var termo = {};

   var versao = "/v1";

   termo.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
         dbTermo.save(dados)
         .then(val => {
           val._links = [
             {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/termos/" + val._key},
             {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/termos/" + val._key},
             {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/termos/" + val._key}
           ]
           res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         });
      }
   };

   termo.listar = function (req,res) {
      dbTermo.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
           var links = {
             _links : [
                 {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/termos"},
                 {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/termos"}
             ]
           };
           val.push(links);
           res.status(200).json(val).end()
         });
      });
   };

   termo.listarTermo = function (req,res) {
     var id = req.params.id;
     dbTermo.document(id)
     .then(val => {
       val._links = [
         {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/termos"},
         {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/termos/" + val._key},
         {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/termos/" + val._key}
       ]
       res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     });
   };

   termo.editar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
         dbTermo.update(dados._key,dados)
         .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/termos"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/termos"},
             {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/termos/" + dados._key},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/termos"}
           ]
           res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         });
      }
   };

   termo.deletar = function (req,res) {
     var dados = req.body;
     dbTermo.remove(dados.id)
     .then(val => {
       val.links = [
         {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/termos"},
         {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/termos"}
       ]
       res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     });
   }

   return termo;
}
