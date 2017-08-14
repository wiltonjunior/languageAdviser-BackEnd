module.exports = function (app) {
   var model = app.model.administrador;
   var Joi = app.get("joi");

   var administrador = {};

   administrador.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
         dados.caminhoImagem = "/imagem/usuario.jpg";
         dados.status = 3;
         var db = req.app.get("database");
         var administrador = db.collection("administrador");
         administrador.save(dados)
         .then(val => {
            val._links = [
              {rel : "procurar", method : "GET", href: "http://191.252.109.164/administradores/" + val._key},
              {rel : "atualizar", method : "PUT", href: "http://191.252.109.164/administradores/" + val._key},
              {rel : "excluir", method : "DELETE", href: "http://191.252.109.164/administradores/" + val._key}
            ]
            res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   administrador.imagem = function (req,res) {
     var id = req.params.id;
     var fs = app.get("fs");
     var formidable = app.get("formidable");
     var hasha = app.get("hasha");
     var path = app.get("path");

     var form = new formidable.IncomingForm();
     form.parse(req,function (err,fields,files) {
         var oldpath = files.photo.path;
         var hash = hasha.fromFileSync(oldpath,{algorithm : "md5"});
         var tipo = path.extname(files.photo.name);
         var imagem = hash + tipo;
         var newpath = "./public/imagem/administrador/" + imagem;
         fs.rename(oldpath,newpath,function (err) {
            if (err) {
              res.status(500).json(err);
            } else {
              var caminhoImagem = "/imagem/administrador/" + imagem;
              var db = req.app.get("database");
              var administrador = db.collection("administrador");
              administrador.update(id,{'caminhoImagem' : caminhoImagem})
              .then(val => {
                 val._links = [
                   {rel : "adicionar", method: "POST", href: "http://191.252.109.164/administradores"},
                   {rel : "listar", method: "GET", href: "http://191.252.109.164/administradores"},
                   {rel : "procurar", method: "GET", href: "http://191.252.109.164/administradores/" + id},
                   {rel : "excluir", method: "DELETE", href: "http://191.252.109.164/administradores/" + id}
                 ]
                 res.status(200).json(val).end()
              }, err => {
                 res.status(500).json(err).end()
              })
            }
         });
     });
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
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://191.252.109.164/administradores"},
          {rel : "editar", method: "PUT", href: "http://191.252.109.164/administradores/" + val._key},
          {rel : "excluir", method: "DELETE", href: "http://191.252.109.164/administradores/" + val._key}
        ]
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
       res.status(400).json(result.error);
     } else {
        var db = req.app.get("database");
        var administrador = db.collection("administrador");
        administrador.update(id,dados)
        .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://191.252.109.164/administradores"},
             {rel : "listar", method: "GET", href: "http://191.252.109.164/administradores"},
             {rel : "procurar", method: "GET", href: "http://191.252.109.164/administradores/" + id},
             {rel : "excluir", method: "DELETE", href: "http://191.252.109.164/administradores/" + id}
           ]
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
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://191.252.109.164/administradores"},
           {rel : "listar", method: "GET", href: "http://191.252.109.164/administradores"}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   };

   return administrador;
}
