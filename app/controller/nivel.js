module.exports = function (app) {
   var model = app.model.nivel;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbNivel = db.collection("nivel");

   var nivel = {};

   var versao = "/v1";

   nivel.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         dbNivel.save(dados)
         .then(val => {
            val._links = [
              {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/niveis/" + val._key},
              {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/niveis/" + val._key},
              {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/niveis/" + val._key}
            ]
            res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   nivel.imagem = function (req,res) {
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
         var newpath = "./public/imagem/nivel/" + imagem;
         fs.rename(oldpath,newpath, function (err) {
            if (err) {
              res.status(500).json(err);
            }
            else {
              var caminhoImagem = "/imagem/nivel/" + imagem;
              dbNivel.update(id,{"caminhoImagem" : caminhoImagem})
              .then(val => {
                 var respostaImagem = {
                   "caminhoImagem" : caminhoImagem
                 }
                 respostaImagem._links = [
                   {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/niveis/" + val._key},
                   {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/niveis/" + val._key},
                   {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/niveis/" + val._key}
                 ]
                 res.status(200).json(respostaImagem).end()
              }, err => {
                 res.status(500).json(err).end()
              })
            }
         });
      });
   };

   nivel.listar = function (req,res) {
     dbNivel.all()
     .then(cursor => {
        cursor.all()
        .then(val => {
           var links = {
             _links : [
                 {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/niveis"},
                 {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/niveis"}
             ]
           };
           val.push(links);
           res.status(200).json(val).end()
        })
     })
   };

   nivel.listarNivel = function (req,res) {
     var id = req.params.id;
     dbNivel.document(id)
     .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/niveis"},
          {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/niveis/" + val._key},
          {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/niveis/" + val._key}
        ]
        res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     })
   };

   nivel.editar = function (req,res) {
     var dados = req.body;
     var result = Joi.validate(dados,model);
     if (result.error!=null) {
       res.status(400).json(result.error);
     }
     else {
       dbNivel.update(dados._key,dados)
       .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/niveis"},
           {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/niveis"},
           {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/niveis/" + dados._key},
           {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/niveis"}
         ]
         res.status(200).json(val).end()
       }, err => {
         res.status(500).json(err).end()
       })
     }
   };

   nivel.deletar = function (req,res) {
     var dados = req.body;
     dbNivel.remove(dados.id)
     .then(val => {
       val._links = [
         {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/niveis"},
         {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/niveis"}
       ]
       res.status(200).json(val).end()
     }, err => {
       res.status(500).json(err).end()
     })
   }



   return nivel;

}
