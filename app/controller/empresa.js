module.exports = function (app) {
   var model = app.model.empresa;
   var Joi = app.get("joi");

   var empresa = {};

   empresa.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if(result.error!=null) {
        res.status(500).json(result.error);
      }
      else {
        var db = req.app.get("database");
        var empresa = db.collection("empresa");
        empresa.save(dados)
        .then(val => {
          res.status(201).json(val,[
            {rel : "procurar", method : "GET", href: "http://localhost:3000/empresa/" + val._key},
            {rel : "atualizar", method : "PUT", href: "http://localhost:3000/empresa/" + val._key},
            {rel : "excluir", method : "DELETE", href: "http://localhost:3000/empresa/" + val._key}
          ]).end()
        }, err => {
           res.status(500).json(err).end();
        });
      }
   };

   empresa.listar = function (req,res) {
      var db = req.app.get("database");
      var empresa = db.collection("empresa");
      empresa.all()
      .then(cursor => {
        cursor.all()
        .then(val => {
          res.status(200).json(val).end()
        });
      });
   };

   empresa.listarEmpresa = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var empresa = db.collection("empresa");
      empresa.document(id)
      .then(val => {
        res.status(200).json(val,[
          {rel : "adicionar", method: "POST", href: "http://localhost:3000/empresa"},
          {rel : "editar", method: "PUT", href: "http://localhost:3000/empresa/" + val._key},
          {rel : "excluir", method: "DELETE", href: "http://localhost:3000/empresa/" + val._key}
        ]).end()
      }, err => {
         res.status(500).json(err).end()
      });
   };

   empresa.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if(result.error!=null) {
         res.status(500).json(result.error);
      }
      else {
        var db = req.app.get("database");
        var empresa = db.collection("empresa");
        empresa.update(id,dados)
        .then(val => {
          res.status(200).json(val,[
            {rel : "adicionar", method: "POST", href: "http://localhost:3000/empresa"},
            {rel : "listar", method: "GET", href: "http://localhost:3000/empresa"},
            {rel : "procurar", method: "GET", href: "http://localhost:3000/empresa/" + id},
            {rel : "excluir", method: "DELETE", href: "http://localhost:3000/empresa" + id}
          ]).end()
        }, err => {
           res.status(500).json(err).end()
        });
      }
   };

   empresa.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var empresa = db.collection("empresa");
      empresa.remove(id)
      .then(val => {
        res.status(200).json(val,[
          {rel : "adicionar", method: "POST", href: "http://localhost:3000/empresa"},
          {rel : "listar", method: "GET", href: "http://localhost:3000/empresa"}
        ]).end()
      }, err => {
         res.status(500).json(err).end()
      });
   }

   return empresa;
}
