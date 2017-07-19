module.exports = function (app) {
   var model = app.model.termos;
   var Joi = app.get("joi");

   var termo = {};

   termo.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(501).json(result.error);
      } else {
         var db = req.app.get("database");
         var termo = db.collection("termos");
         termo.save(dados)
         .then(val => {
            res.status(200).json(val).end()
         }, err => {
            res.status(501).json(err).end()
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
            res.status(200).json(val).end();
         });
      });
   };

   termo.listarTermo = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
     var termo = db.collection("termos");
     termo.document(id)
     .then(val => {
        res.status(200).json(val).end()
     }, err => {
        res.status(501).json(err).end()
     });
   };

   termo.listarIdioma = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
     db.query('FOR idioma IN idioma FOR termo IN termos FILTER termo._key == @id and termo.idIdioma == idioma._key RETURN idioma',{'id' : id})
     .then(cursor => {
        cursor.next()
        .then(val => {
          res.status(200).json(val).end()
        });
     });
   }

   termo.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(501).json(result.error);
      } else {
         var db = req.app.get("database");
         var termo = db.collection("termos");
         termo.update(id,dados)
         .then(val => {
            res.status(200).json(val).end()
         }, err => {
            res.status(501).json(err).end()
         });
      }
   };

   termo.deletar = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
     var termo = db.collection("termos");
     termo.remove(id)
     .then(val => {
        res.status(200).json(val).end()
     }, err => {
        res.status(501).json(err).end()
     });
   }

   return termo;
}
