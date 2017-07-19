module.exports = function (app) {
   var model = app.model.regiao;
   var Joi = app.get("joi");

   var regiao = {};

   regiao.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(501).json(result.error);
      }
      else {
         var db = req.app.get("database");
         var regiao = db.collection("regiao");
         regiao.save(dados)
         .then(val => {
            res.status(200).json(val).end()
         }, err => {
            res.status(501).json(err).end()
         });
      }
   };

   regiao.listar = function (req,res) {
      var db = req.app.get("database");
      var regiao = db.collection("regiao");
      regiao.all()
      .then(cursor => {
        cursor.all()
        .then(val => {
           res.status(200).json(val).end()
        });
      });
   };

   regiao.listarRegiao = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var regiao = db.collection("regiao");
      regiao.document(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err=> {
         res.status(501).json(err).end()
      });
   };

   regiao.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(501).json(result.error);
      }
      else {
         var db = req.app.get("database");
         var regiao = db.collection("regiao");
         regiao.update(id,dados)
         .then(val => {
            res.status(200).json(val).end()
         }, err=> {
            res.status(501).json(err).end()
         });
      }
   };

   regiao.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var regiao = db.collection("regiao");
      regiao.remove(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(501).json(err).end()
      });
   }

   return regiao;
}
