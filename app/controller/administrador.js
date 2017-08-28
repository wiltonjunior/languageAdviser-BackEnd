module.exports = function (app) {
   var model = app.model.administrador;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbAdministrador = db.collection("administrador");

   var administrador = {};

   administrador.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
         dados.caminhoImagem = "/imagem/usuario.jpg";
         dados.status = 3;
         dbAdministrador.save(dados)
         .then(val => {
            val._links = [
              {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/administradores/" + val._key},
              {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/administradores/" + val._key},
              {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/administradores/" + val._key}
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
              dbAdministrador.update(id,{'caminhoImagem' : caminhoImagem})
              .then(val => {
                 val._links = [
                   {rel : "adicionar", method: "POST", href:"http://" + req.headers.host + "/administradores"},
                   {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/administradores"},
                   {rel : "procurar", method: "GET", href: "http://" + req.headers.host + "/administradores/" + id},
                   {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/administradores/" + id}
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
      dbAdministrador.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            var links = {
              _links : [
                  {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/administradores"},
                  {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/administradores"}
                ]
            };
            val.push(links);
            res.status(200).json(val).end()
         })
      })
   };

   administrador.listarAdministrador = function (req,res) {
     var id = req.params.id;
     dbAdministrador.document(id)
     .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/administradores"},
          {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/administradores/" + val._key},
          {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/administradores/" + val._key}
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
        dbAdministrador.update(id,dados)
        .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/administradores"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/administradores"},
             {rel : "procurar", method: "GET", href: "http://" + req.headers.host + "/administradores/" + id},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/administradores/" + id}
           ]
           res.status(200).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
     }
  };

   administrador.deletar = function (req,res) {
      var id = req.params.id;
      dbAdministrador.remove(id)
      .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/administradores"},
           {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/administradores"}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   };

   return administrador;
}
