module.exports = function (app) {
   var model = app.model.empresa;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbEmpresa = db.collection("empresa");

   var empresa = {};

   empresa.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if(result.error!=null) {
        res.status(400).json(result.error);
      }
      else {
        dbEmpresa.save(dados)
        .then(val => {
          val._links = [
            {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/empresas/" + val._key},
            {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/empresas/" + val._key},
            {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/empresas/" + val._key}
          ]
          res.status(201).json(val).end()
        }, err => {
           res.status(500).json(err).end();
        });
      }
   };

   empresa.listar = function (req,res) {
      dbEmpresa.all()
      .then(cursor => {
        cursor.all()
        .then(val => {
          res.status(200).json(val).end();
        });
      });
   };

   empresa.listarEmpresa = function (req,res) {
      var id = req.params.id;
      dbEmpresa.document(id)
      .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/empresas"},
          {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/empresas/" + val._key},
          {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/empresas/" + val._key}
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
        dbEmpresa.update(id,dados)
        .then(val => {
          val._links = [
            {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/empresas"},
            {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/empresas"},
            {rel : "procurar", method: "GET", href: "http://" + req.headers.host + "/empresas/" + id},
            {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/empresas/" + id}
          ]
          res.status(200).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        });
      }
   };

   empresa.deletar = function (req,res) {
      var id = req.params.id;
      dbEmpresa.remove(id)
      .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/empresas"},
          {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/empresas"}
        ]
        res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      });
   }

   return empresa;
}
