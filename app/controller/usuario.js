module.exports = function (app) {
   var model = app.model.usuario;
   var Joi = app.get("joi");

   var usuario = {};

   usuario.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(500).json(result.error);
      } else {
         var db = req.app.get("database");
         var usuario = db.collection("usuario");
         usuario.save(dados)
         .then(val => {
            res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

  usuario.listar = function (req,res) {
      var db = req.app.get("database");
      var usuario = db.collection("usuario");
      usuario.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   };

   usuario.listarUsuario = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var usuario = db.collection("usuario");
      usuario.document(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   };

   usuario.listarUsuarioEspecifico = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query("LET aluno = (FOR aluno IN aluno FILTER aluno._key == @id RETURN aluno) RETURN length(aluno)",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
             if(val==0) {
                db.query("LET autor = (FOR autor IN autor FILTER autor._key == @id RETURN autor) RETURN length(autor)",{'id' : id})
                .then(cursor => {
                   cursor.next()
                   .then(val => {
                      res.status(200).json(val).end()
                   })
                })
             }
             else {
               res.status(200).json(val).end()
             }
         })
      })
   };

   usuario.listarIdioma = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query("LET usuario = (FOR usuario IN usuario FILTER usuario.idUsuario == @id RETURN usuario.idIdioma) FOR idioma IN idioma FOR u IN usuario FILTER idioma._key == u or idioma._key IN u RETURN idioma")
      .then(cursor => {
         cursor.next()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   };

   usuario.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(500).json(result.error);
      } else {
         var db = req.app.get("database");
         var usuario = db.collection("usuario");
         usuario.update(id,dados)
         .then(val => {
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   usuario.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var usuario = db.collection("usuario");
      usuario.remove(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }

   return usuario;
}
