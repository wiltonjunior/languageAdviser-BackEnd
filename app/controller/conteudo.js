module.exports = function (app) {
   var model = app.model.conteudo;
   var Joi = app.get("joi");

   var conteudo = {};

   conteudo.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(501).json(result.error);
      } else {
         var db = req.app.get("database");
         var conteudo = db.collection("conteudo");
         conteudo.save(dados)
         .then(val => {
            res.status(201).json(val,[
              {rel : "procurar", method : "GET", href: "https://languageadviser.herokuapp.com//conteudo/" + val._key},
              {rel : "atualizar", method : "PUT", href: "https://languageadviser.herokuapp.com//conteudo/" + val._key},
              {rel : "excluir", method : "DELETE", href: "https://languageadviser.herokuapp.com//conteudo/" + val._key}
            ]).end()
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
         res.status(200).json(val,[
           {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/conteudo"},
           {rel : "idioma", method: "GET", href: "https://languageadviser.herokuapp.com/conteudo/idioma/" + val._key},
           {rel : "editar", method: "PUT", href: "https://languageadviser.herokuapp.com/conteudo/" + val._key},
           {rel : "excluir", method: "DELETE", href: "https://languageadviser.herokuapp.com/conteudo/" + val._key}
         ]).end()
      }, err => {
         res.status(500).json(err).end()
      });
   };

   conteudo.listarIdioma = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query('FOR idioma IN idioma FOR conteudo IN conteudo FILTER conteudo._key == @id and conteudo.idIdioma == idioma._key RETURN idioma',{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
            res.status(200).json(val,[
              {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/conteudo"},
              {rel : "listar", method: "GET", href: "https://languageadviser.herokuapp.com/conteudo"},
              {rel : "editar", method: "PUT", href: "https://languageadviser.herokuapp.com/conteudo/" + id},
              {rel : "excluir", method: "DELETE", href: "https://languageadviser.herokuapp.com/conteudo/" + id}
            ]).end();
         });
      });
   };


   conteudo.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(501).json(result.error);
      } else {
         var db = req.app.get("database");
         var conteudo = db.collection("conteudo");
         conteudo.update(id,dados)
         .then(val => {
            res.status(200).json(val,[
              {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/conteudo"},
              {rel : "listar", method: "GET", href: "https://languageadviser.herokuapp.com/conteudo"},
              {rel : "procurar", method: "GET", href: "https://languageadviser.herokuapp.com/conteudo/" + id},
              {rel : "excluir", method: "DELETE", href: "https://languageadviser.herokuapp.com/conteudo" + id}
            ]).end()
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
          res.status(200).json(val,[
            {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/conteudo"},
            {rel : "listar", method: "GET", href: "https://languageadviser.herokuapp.com/conteudo"}
          ]).end()
       }, err => {
          res.status(500).json(err).end()
       });
   };

   return conteudo;
}
