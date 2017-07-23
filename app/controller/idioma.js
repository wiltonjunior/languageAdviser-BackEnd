module.exports = function (app) {
    var model = app.model.idioma;
    var Joi = app.get("joi");

    var idioma = {};

    idioma.salvar = function (req,res) {
       var dados = req.body;
       var result = Joi.validate(dados,model);
       if (result.error!=null) {
          res.status(501).json(result.error);
       } else {
          var db = req.app.get("database");
          var idioma = db.collection("idioma");
          idioma.save(dados)
          .then(val => {
             res.status(201).json(val).end()
          }, err => {
             res.status(501).json(err).end()
          });
       }
    };

    idioma.listar = function (req,res) {
       var db = req.app.get("database");
       var idioma = db.collection("idioma");
       idioma.all()
       .then(cursor => {
          cursor.all()
          .then(val => {
             res.status(200).json(val).end()
          }, err => {
             res.status(501).json(err).end()
          });
       });
    };

    idioma.listarIdioma = function (req,res) {
       var id = req.params.id;
       var db = req.app.get("database");
       var idioma = db.collection("idioma");
       idioma.document(id)
       .then(val => {
          res.status(200).json(val).end()
       }, err => {
          res.status(501).json(err).end()
       });
    };

    idioma.editar = function (req,res) {
       var id = req.params.id;
       var dados = req.body;
       var result = Joi.validate(dados,model);
       if (result.error!=null) {
          res.status(501).json(result.error);
       } else {
          var db = req.app.get("database");
          var idioma = db.collection("idioma");
          idioma.update(id,dados)
          .then(val => {
             res.status(200).json(val).end()
          }, err => {
             res.status(501).json(err).end()
          });
       }
    };

    idioma.deletar = function (req,res) {
       var id = req.params.id;
       var db = req.app.get("database");
       var idioma = db.collection("idioma");
       idioma.remove(id)
       .then(val => {
          res.status(200).json(val).end()
       }, err => {
          res.status(501).json(err).end()
       });
    }

    return idioma;
}
