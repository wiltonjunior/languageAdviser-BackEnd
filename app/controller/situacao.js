module.exports = function (app) {
   var model = app.model.situacao;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbSituacao = db.collection("situacao");

   var cache = app.get("cache");

   var situacao = {};

   var versao = "/v1";

   situacao.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         dbSituacao.save(dados)
         .then(val => {
            val._links = [
              {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/situacoes/" + val._key},
              {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/situacoes/" + val._key},
              {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/situacoes/" + val._key}
            ]
            res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   situacao.imagem = function (req,res) {
      var id = req.params.id;
      var fs = app.get("fs");
      var formidable = app.get("formidable");
      var hasha = app.get("hasha");
      var path = app.get("path");


      var form = new formidable.IncomingForm();
      form.parse(req, function (err,fields,files) {
         var oldpath = files.photo.path;
         var hash = hasha.fromFileSync(oldpath,{algorithm : "md5"});
         var tipo = path.extname(files.photo.name);
         var imagem = hash + tipo;
         var newpath = "./public/imagem/situacao/" + imagem;
         fs.rename(oldpath,newpath, function (err) {
            if(err) {
              res.status(500).json(err).end()
            }
            else {
              var caminhoImagem = "/imagem/situacao/" + imagem;
              dbSituacao.update(id,{"caminhoImagem" : caminhoImagem})
              .then(val => {
                var respostaImagem = {
                  "caminhoImagem" : caminhoImagem
                }
                respostaImagem._links = [
                  {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/situacoes/" + val._key},
                  {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/situacoes/" + val._key},
                  {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/situacoes/" + val._key}
                ]
                res.status(200).json(respostaImagem).end()
              }, err => {
                res.status(500).json(err).end()
              })
            }
         });
      });
   };

   situacao.listar = function (req,res) {
      var resultado = cache.get("listarSituacao");
      if(resultado==undefined) {
        dbSituacao.all()
        .then(cursor => {
           cursor.all()
           .then(val => {
              var links = {
                 _links : [
                     {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/situacoes"},
                     {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/situacoes"}
                 ]
              };
              val.push(links);
              cache.set("listarSituacao",val,10);
              res.status(200).json(val).end()
           })
        })
      }
      else {
         res.status(200).json(resultado).end()
      }
   };

   situacao.listarSituacao = function (req,res) {
      var id = req.params.id;
      var nomeCache = "listarSituacao" + id;
      var resultado = cache.get(nomeCache);
      if(resultado==undefined) {
        dbSituacao.document(id)
        .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/situacoes"},
             {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/situacoes/" + val._key},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/situacoes/" + val._key}
           ]
           cache.set(nomeCache,val,20);
           res.status(200).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
      }
      else {
         res.status(200).json(resultado).end()
      }
   };

   situacao.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         dbSituacao.update(id,dados)
         .then(val => {
            val._links = [
              {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/situacoes"},
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/situacoes"},
              {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/situacoes/" + id},
              {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/situacoes/" + id}
            ]
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   situacao.deletar = function (req,res) {
     var id = req.params.id;
     dbSituacao.remove(id)
     .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/situacoes"},
          {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/situacoes"}
        ]
        res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     })
   }

   return situacao;

}
