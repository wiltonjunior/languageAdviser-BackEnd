module.exports = function (app) {
    var model = app.model.idioma;
    var Joi = app.get("joi");

    var idioma = {};

    idioma.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
        res.status(400).json(result.error);
      } else {
        var db = req.app.get("database");
        var idioma = db.collection("idioma");
        idioma.save(dados)
        .then(val => {
           val._links = [
             {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/idiomas/" + val._key},
             {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/idiomas/" + val._key},
             {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/idiomas/" + val._key}
           ]
           res.status(201).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
      }
    };

    idioma.imagem = function (req,res) {
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
         var newpath = "./public/imagem/idioma/" + imagem;
         fs.rename(oldpath,newpath,function (err) {
            if (err) {
               res.status(500).json(result.error);
            } else {
               var caminhoImagem = "/imagem/idioma/" + imagem;
               var db = app.get("database");
               var idioma = db.collection("idioma");
               idioma.update(id,{"caminhoImagem" : caminhoImagem})
               .then(val => {
                 val._links = [
                    {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/idiomas/" + val._key},
                    {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/idiomas/" + val._key},
                    {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/idiomas/" + val._key}
                  ]
                  res.status(200).json(val).end()
               }, err => {
                  res.status(500).json(err).end()
               })
            }
         })
      });
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
             res.status(500).json(err).end()
          });
       });
    };

    idioma.listarIdioma = function (req,res) {
       var id = req.params.id;
       var db = req.app.get("database");
       var idioma = db.collection("idioma");
       idioma.document(id)
       .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/idiomas"},
           {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/idiomas/" + val._key},
           {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/idiomas/" + val._key}
         ]
         res.status(200).json(val).end()
       }, err => {
          res.status(500).json(err).end()
       });
    };

    idioma.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
        res.status(400).json(result.error);
      } else {
        var db = req.app.get("database");
        var idioma = db.collection("idioma");
        idioma.update(id,dados)
        .then(val => {
          val._links = [
            {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/idiomas/" + val._key},
            {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/idiomas/" + val._key},
            {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/idiomas/" + val._key}
          ]
          res.status(200).json(val).end()
        }, err => {
          res.status(500).json(err).end()
        })
      }
    };

    idioma.deletar = function (req,res) {
       var id = req.params.id;
       var db = req.app.get("database");
       var idioma = db.collection("idioma");
       idioma.remove(id)
       .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/idiomas"},
           {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/idiomas"}
         ]
         res.status(200).json(val).end()
       }, err => {
          res.status(500).json(err).end()
       });
    }

    return idioma;
}
