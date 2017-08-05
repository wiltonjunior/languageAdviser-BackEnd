module.exports = function (app) {
   var model = app.model.empresa;
   var Joi = app.get("joi");

   var empresa = {};

   empresa.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if(result.error!=null) {
        res.status(400).json(result.error);
      }
      else {
        var db = req.app.get("database");
        var empresa = db.collection("empresa");
        empresa.save(dados)
        .then(val => {
          val._links = [
            {rel : "procurar", method : "GET", href: "http://191.252.109.164/empresas/" + val._key},
            {rel : "atualizar", method : "PUT", href: "http://191.252.109.164/empresas/" + val._key},
            {rel : "excluir", method : "DELETE", href: "http://191.252.109.164/empresas/" + val._key}
          ]
          res.status(201).json(val).end()
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
          res.status(200).json(val).end();
        });
      });
   };

   empresa.listarEmpresa = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var empresa = db.collection("empresa");
      empresa.document(id)
      .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://191.252.109.164/empresas"},
          {rel : "editar", method: "PUT", href: "http://191.252.109.164/empresas/" + val._key},
          {rel : "excluir", method: "DELETE", href: "http://191.252.109.164/empresas/" + val._key}
        ]
        res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      });
   };

   empresa.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if(result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
        var db = req.app.get("database");
        var empresa = db.collection("empresa");
        empresa.update(id,dados)
        .then(val => {
          val._links = [
            {rel : "adicionar", method: "POST", href: "http://191.252.109.164/empresas"},
            {rel : "listar", method: "GET", href: "http://191.252.109.164/empresas"},
            {rel : "procurar", method: "GET", href: "http://191.252.109.164/empresas/" + id},
            {rel : "excluir", method: "DELETE", href: "http://191.252.109.164/empresas/" + id}
          ]
          res.status(200).json(val).end()
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
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://191.252.109.164/empresas"},
          {rel : "listar", method: "GET", href: "http://191.252.109.164/empresas"}
        ]
        res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      });
   }

   return empresa;
}
