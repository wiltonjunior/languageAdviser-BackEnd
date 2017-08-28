module.exports = function (app) {
   var model = app.model.situacao;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbSituacao = db.collection("situacao");

   var situacao = {};

   situacao.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         dbSituacao.save(dados)
         .then(val => {
            val._links = [
              {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/situacoes/" + val._key},
              {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/situacoes/" + val._key},
              {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/situacoes/" + val._key}
            ]
            res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   situacao.listar = function (req,res) {
      dbSituacao.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            var links = {
               _links : [
                   {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/situacoes"},
                   {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/situacoes"}
               ]
            }
            res.status(200).json(val).end()
         })
      })
   };

   situacao.listarSituacao = function (req,res) {
      var id = req.params.id;
      dbSituacao.document(id)
      .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/situacoes"},
           {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/situacoes/" + val._key},
           {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/situacoes/" + val._key}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   };

   situacao.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         dbSituacao.update(id,dados)
         .then(val => {
            val._links = [
              {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/situacoes"},
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/situacoes"},
              {rel : "procurar", method: "GET", href: "http://" + req.headers.host + "/situacoes/" + id},
              {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/situacoes/" + id}
            ]
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   situacao.deletar = function (req,res) {
     var id = req.params.id;
     dbSituacao.remove(id)
     .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/situacoes"},
          {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/situacoes"}
        ]
        res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     })
   }

   return situacao;

}
