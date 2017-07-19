module.exports = function (app) {
   var model = app.model.empresa;
   var Joi = app.get("joi");

   var empresa = {};

   empresa.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if(result.error!=null) {
        res.status(501).json(result.error);
      }
      else {
        var db = req.app.get("database");
        var empresa = db.collection("empresa");
        empresa.save(dados)
        .then(val => {           
           res.status(200).json(val).end();
        }, err => {
           res.status(501).json(err).end();
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

   empresa.listarContratante = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var empresa = db.collection("empresa");
      empresa.document(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(501).json(err).end()
      });
   };

   empresa.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if(result.error!=null) {
         res.status(501).json(result.error);
      }
      else {
        var db = req.app.get("database");
        var empresa = db.collection("empresa");
        empresa.update(id,dados)
        .then(val => {
           res.status(200).json(val).end()
        }, err => {
           res.status(501).json(err).end()
        });
      }
   };

   empresa.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var empresa = db.collection("empresa");
      empresa.remove(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(501).json(err).end()
      });
   }

   return empresa;
}
