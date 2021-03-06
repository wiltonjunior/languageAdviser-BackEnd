module.exports = function (app) {
    var model = app.model.idioma;
    var Joi = app.get("joi");
    var db = app.get("database");
    var dbIdioma = db.collection("idioma");

    var cache = app.get("cache");

    var idioma = {};

    var versao = "/v1";

    idioma.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
        res.status(400).json(result.error);
      } else {
        dbIdioma.save(dados)
        .then(val => {
           val._links = [
             {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/idiomas/" + val._key},
             {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/idiomas/" + val._key},
             {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/idiomas/" + val._key}
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
               res.status(500).json(err);
            } else {
               var caminhoImagem = "/imagem/idioma/" + imagem;
               dbIdioma.update(id,{"caminhoImagem" : caminhoImagem})
               .then(val => {
                 var respostaImagem = {
                   "caminhoImagem" : caminhoImagem
                 }
                 respostaImagem._links = [
                   {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/idiomas/" + val._key},
                   {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/idiomas/" + val._key},
                   {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/idiomas/" + val._key}
                 ]
                 res.status(200).json(respostaImagem).end()
               }, err => {
                  res.status(500).json(err).end()
               })
            }
         })
      });
    };

    idioma.listar = function (req,res) {
       var resultado = cache.get("listarIdioma");
       if(resultado==undefined) {
         dbIdioma.all()
         .then(cursor => {
            cursor.all()
            .then(val => {
              var links = {
                _links : [
                  {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/idiomas"},
                  {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/idiomas"}
                ]
              };
              val.push(links);
              cache.set("listarIdioma",val,10);
              res.status(200).json(val).end()
            });
         });
       }
       else {
          res.status(200).json(resultado).end()
       }
    };

    idioma.listarIdioma = function (req,res) {
       var id = req.params.id;
       var nomeCache = "listarIdioma" + id;
       var resultado = cache.get(nomeCache);
       if(resultado==undefined) {
         dbIdioma.document(id)
         .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/idiomas"},
             {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/idiomas/" + val._key},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/idiomas/" + val._key}
           ]
           cache.set(nomeCache,val,20);
           res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         });
       }
       else {
         res.status(200).json(resultado).end()
       }
    };

    idioma.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
        res.status(400).json(result.error);
      } else {
        dbIdioma.update(id,dados)
        .then(val => {
          val._links = [
            {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/idiomas/" + val._key},
            {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/idiomas/" + val._key},
            {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/idiomas/" + val._key}
          ]
          res.status(200).json(val).end()
        }, err => {
          res.status(500).json(err).end()
        })
      }
    };

    idioma.deletar = function (req,res) {
       var id = req.params.id;
       dbIdioma.remove(id)
       .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/idiomas"},
           {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/idiomas"}
         ]
         res.status(200).json(val).end()
       }, err => {
          res.status(500).json(err).end()
       });
    }

    return idioma;
}
