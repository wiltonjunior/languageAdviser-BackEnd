module.exports = function (app) {
   var model = app.model.regiao;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbRegiao = db.collection("regiao");

   var regiao = {};

   var versao = "/v1";

   regiao.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         dbRegiao.save(dados)
         .then(val => {
           val._links = [
             {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/regioes/" + val._key},
             {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/regioes/" + val._key},
             {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/regioes/" + val._key}
           ]
           res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         });
      }
   };

   regiao.listar = function (req,res) {
      dbRegiao.all()
      .then(cursor => {
        cursor.all()
        .then(val => {
          var links = {
            _links : [
              {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/regioes"},
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/regioes"}
            ]
          };
          val.push(links);
          res.status(200).json(val).end()
        });
      });
   };

   regiao.listarRegiao = function (req,res) {
      var id = req.params.id;
      dbRegiao.document(id)
      .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/regioes"},
          {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/regioes/" + val._key},
          {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/regioes/" + val._key}
        ]
        res.status(200).json(val).end()
      }, err=> {
         res.status(500).json(err).end()
      });
   };

   regiao.editar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         dbRegiao.update(dados._key,dados)
         .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/regioes"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/regioes"},
             {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/regioes/" + dados._key},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/regioes"}
           ]
           res.status(200).json(val).end()
         }, err=> {
            res.status(500).json(err).end()
         });
      }
   };

   regiao.deletar = function (req,res) {
      var dados = req.body;
      dbRegiao.remove(dados.id)
      .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/regioes"},
          {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/regioes"}
        ]
        res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      });
   }

   return regiao;
}
