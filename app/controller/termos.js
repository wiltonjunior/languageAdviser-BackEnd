module.exports = function (app) {
   var model = app.model.termos;
   var Joi = app.get("joi");

   var termo = {};

   termo.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
         var db = req.app.get("database");
         var termo = db.collection("termos");
         termo.save(dados)
         .then(val => {
           val._links = [
             {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/termos/" + val._key},
             {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/termos/" + val._key},
             {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/termos/" + val._key}
           ]
           res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         });
      }
   };

   termo.listar = function (req,res) {
      var db = req.app.get("database");
      var termo = db.collection("termos");
      termo.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
           res.status(200).json(val).end()
         });
      });
   };

   termo.listarTermo = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
     var termo = db.collection("termos");
     termo.document(id)
     .then(val => {
       val._links = [
         {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/termos"},
         {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/termos/" + val._key},
         {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/termos/" + val._key}
       ]
       res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     });
   };

   termo.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
         var db = req.app.get("database");
         var termo = db.collection("termos");
         termo.update(id,dados)
         .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/termos"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/termos"},
             {rel : "procurar", method: "GET", href: "http://" + req.headers.host + "/termos/" + id},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/termos/" + id}
           ]
           res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         });
      }
   };

   termo.deletar = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
     var termo = db.collection("termos");
     termo.remove(id)
     .then(val => {
       val.links = [
         {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/termos"},
         {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/termos"}
       ]
       res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     });
   }

   return termo;
}
