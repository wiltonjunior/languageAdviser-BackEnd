module.exports = function (app) {
   var model = app.model.situacao;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbSituacao = db.collection("situacao");

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
            res.status(200).json(val).end()
         })
      })
   };

   situacao.listarSituacao = function (req,res) {
      var id = req.params.id;
      dbSituacao.document(id)
      .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/situacoes"},
           {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/situacoes/" + val._key},
           {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/situacoes/" + val._key}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   };

   situacao.editar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         dbSituacao.update(dados._key,dados)
         .then(val => {
            val._links = [
              {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/situacoes"},
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/situacoes"},
              {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/situacoes/" + dados._key},
              {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/situacoes"}
            ]
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   situacao.deletar = function (req,res) {
     var dados = req.body;
     dbSituacao.remove(dados.id)
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
