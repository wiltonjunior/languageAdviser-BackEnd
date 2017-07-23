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
            res.status(201).json(val).end()
         }, err => {
            res.status(501).json(err).end()
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
         res.status(200).json(val).end()
      }, err => {
         res.status(501).json(err).end()
      });
   };

   conteudo.listarIdioma = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query('FOR idioma IN idioma FOR conteudo IN conteudo FILTER conteudo._key == @id and conteudo.idIdioma == idioma._key RETURN idioma',{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
            res.status(200).json(val).end();
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
            res.status(200).json(val).end()
         }, err => {
            res.status(501).json(err).end()
         });
      }
   };

   conteudo.deletar = function (req,res) {
       var id = req.params.id;
       var db = req.app.get("database");
       var conteudo = db.collection("conteudo");
       conteudo.remove(id)
       .then(val => {
          res.status(200).json(val).end()
       }, err => {
          res.status(501).json(err).end()
       });
   };

   return conteudo;
}
