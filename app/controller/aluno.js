module.exports = function (app) {
   var model = app.model.aluno;
   var Joi = app.get("joi");

   var aluno = {};

   aluno.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(500).json(result.error);
      } else {
         var db = req.app.get("database");
         var aluno = db.collection("aluno");
         aluno.save(dados)
         .then(val => {
            res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   aluno.listar = function (req,res) {
      var db = req.app.get("database");
      var aluno = db.collection("aluno");
      aluno.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   };

   aluno.listarAluno = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
     var aluno = db.collection("aluno");
     aluno.document(id)
     .then(val => {
        res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     })
   };

   aluno.editar = function (req,res) {
     var id = req.params.id;
     var dados = req.body;
     var result = Joi.validate(dados,model);
     if (result.error!=null) {
       res.status(500).json(result.error);
     } else {
       var db = req.app.get("database");
       var aluno = db.collection("aluno");
       aluno.update(dados)
       .then(val => {
          res.status(200).json(val).end()
       }, err => {
          res.status(500).json(err).end()
       })
     }
   };

   aluno.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var aluno = db.collection("aluno");
      aluno.remove(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }

   return aluno;
}
