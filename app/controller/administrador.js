module.exports = function (app) {
   var model = app.model.administrador;
   var Joi = app.get("joi");

   var administrador = {};

   administrador.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(500).json(result.error);
      } else {
         var db = req.app.get("database");
         var administrador = db.collection("administrador");
         administrador.save(dados)
         .then(val => {
            val._links = [
              
            ]
            res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   administrador.listar = function (req,res) {
      var db = req.app.get("database");
      var administrador = db.collection("administrador");
      administrador.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   };

   administrador.listarAdministrador = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
     var administrador = db.collection("administrador");
     administrador.document(id)
     .then(val => {
        res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     })
   };

   administrador.editar = function (req,res) {
     var id = req.params.id;
     var dados = req.body;
     var result = Joi.validate(dados,model);
     if (result.error!=null) {
        res.status(500).json(result.error);
     } else {
        var db = req.app.get("database");
        var administrador = db.collection("database");
        administrador.update(id,dados)
        .then(val => {
           res.status(200).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
     }
   };

   administrador.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var administrador = db.collection("administrador");
      administrador.remove(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   };

   return administrador;
}
