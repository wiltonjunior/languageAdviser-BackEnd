module.exports = function (app) {
   var model = app.model.termos;
   var Joi = app.get("joi");

   var termo = {};

   termo.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(500).json(result.error);
      } else {
         var db = req.app.get("database");
         var termo = db.collection("termos");
         termo.save(dados)
         .then(val => {
           res.status(201).json(val,[
             {rel : "procurar", method : "GET", href: "https://languageadviser.herokuapp.com/termos/" + val._key},
             {rel : "atualizar", method : "PUT", href: "https://languageadviser.herokuapp.com/termos/" + val._key},
             {rel : "excluir", method : "DELETE", href: "https://languageadviser.herokuapp.com/termos/" + val._key}
           ]).end()
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
       res.status(200).json(val,[
         {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/termos"},
         {rel : "editar", method: "PUT", href: "https://languageadviser.herokuapp.com/termos/" + val._key},
         {rel : "excluir", method: "DELETE", href: "https://languageadviser.herokuapp.com/termos/" + val._key}
       ]).end()
     }, err => {
        res.status(500).json(err).end()
     });
   };

   termo.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(500).json(result.error);
      } else {
         var db = req.app.get("database");
         var termo = db.collection("termos");
         termo.update(id,dados)
         .then(val => {
           res.status(200).json(val,[
             {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/termos"},
             {rel : "listar", method: "GET", href: "https://languageadviser.herokuapp.com/termos"},
             {rel : "procurar", method: "GET", href: "https://languageadviser.herokuapp.com/termos/" + id},
             {rel : "excluir", method: "DELETE", href: "https://languageadviser.herokuapp.com/termos" + id}
           ]).end()
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
       res.status(200).json(val,[
         {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/termos"},
         {rel : "listar", method: "GET", href: "https://languageadviser.herokuapp.com/termos"}
       ]).end()
     }, err => {
        res.status(500).json(err).end()
     });
   }

   return termo;
}
