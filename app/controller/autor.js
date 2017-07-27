module.exports = function (app) {
   var model = app.model.autor;
   var Joi = app.get("joi");

   var autor = {};

   autor.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
        res.status(500).json(result.error);
      } else {
        var db = req.app.get("database");
        var autor = db.collection("autor");
        autor.save(dados)
        .then(val => {
           res.status(201).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
      }
   };

   autor.listar = function (req,res) {
      var db = req.app.get("database");
      var autor = db.collection("autor");
      autor.all()
      .then(cursor => {
        cursor.all()
        .then(val => {
           res.status(200).json(val).end()
        })
      })
   };

   autor.listarAutor = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var autor = db.collection("autor");
      autor.document(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   };

   autor.listarIdioma = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query("FOR idioma IN idioma FOR autor IN autor FILTER autor._key == @id and autor.idIdioma == idioma._key RETURN idioma",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   };

   autor.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(500).json(result.error);
      } else {
         var db = req.app.get("database");
         var autor = db.collection("autor");
         autor.update(dados)
         .then(val => {
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   autor.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var autor = db.collection("autor");
      autor.remove(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }

   return autor;
}
