module.exports = function (app) {
   var model = app.model.conteudo;
   var Joi = app.get("joi");

   var conteudo = {};

   conteudo.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
         var db = req.app.get("database");
         var conteudo = db.collection("conteudo");
         conteudo.save(dados)
         .then(val => {
            val.links = [
              {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/conteudos/" + val._key},
              {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/conteudos/" + val._key},
              {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/conteudos/" + val._key}
            ]
            res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         });
      }
   };

   conteudo.listar = function (req,res) {
      var db = req.app.get("database");
      var conteudo = db.collection("conteudo");
      conteudo.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            res.status(200).json(val).end()
         });
      });
   };

   conteudo.listarConteudo = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var conteudo = db.collection("conteudo");
      conteudo.document(id)
      .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/conteudos"},
           {rel : "idioma", method: "GET", href: "http://" + req.headers.host + "/conteudos/idioma/" + val._key},
           {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/conteudos/" + val._key},
           {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/conteudos/" + val._key}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      });
   };

   conteudo.listarIdioma = function (req,res) {
      var idIdioma = req.params.idIdioma;
      var db = req.app.get("database");
      db.query('FOR conteudo IN conteudo FOR idioma IN idioma FILTER idioma._key == @id and conteudo.idIdioma == idioma._key RETURN conteudo',{'id' : idIdioma})
      .then(cursor => {
         cursor.all()
         .then(val => {
            val._links = [
              {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/conteudos"},
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/conteudos"}
            ]
            res.status(200).json(val).end();
         });
      });
   };


   conteudo.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
         var db = req.app.get("database");
         var conteudo = db.collection("conteudo");
         conteudo.update(id,dados)
         .then(val => {
            val._links = [
              {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/conteudos"},
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/conteudos"},
              {rel : "procurar", method: "GET", href: "http://" + req.headers.host + "/conteudos/" + id},
              {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/conteudos/" + id}
            ]
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         });
      }
   };

   conteudo.deletar = function (req,res) {
       var id = req.params.id;
       var db = req.app.get("database");
       var conteudo = db.collection("conteudo");
       conteudo.remove(id)
       .then(val => {
          val._links = [
            {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/conteudos"},
            {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/conteudos"}
          ]
          res.status(200).json(val).end()
       }, err => {
          res.status(500).json(err).end()
       });
   };

   return conteudo;
}
