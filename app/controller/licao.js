module.exports = function (app) {
   var model = app.model.licao;
   var Joi = app.get("joi");

   var licao = {};

   licao.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(500).json(result.error);
      } else {
          var db = req.app.get("database");
          var licao = db.collection("licao");
          licao.save(dados)
          .then(val => {
             res.status(201).json(val).end()
          }, err => {
             res.status(500).json(err).end()
          })
      }
   };

   licao.listar = function (req,res) {
      var db = req.app.get("database");
      var licao = db.collection("licao");
      licao.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   };

   licao.listarLicao = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var licao = db.collection("licao");
      licao.document(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   };

   licao.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(500).json(result.error).end()
      } else {
         var db = req.app.get("database");
         var licao = db.collection("licao");
         licao.update(dados)
         .then(val => {
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   licao.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var licao = db.collection("licao");
      licao.remove(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }

   return licao;
}
