module.exports = function (app) {
   var model = app.model.autor;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbAutor = db.collection("autor");

   var autor = {};

   autor.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
        res.status(400).json(result.error);
      } else {
        dados.caminhoImagem = "/imagem/usuario.jpg";
        dados.status = 2;
        dbAutor.save(dados)
        .then(val => {
           val._links = [
            {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/autores/" + val._key},
            {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/autores/" + val._key},
            {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/autores/" + val._key}
           ]
           res.status(201).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
      }
   };

   autor.imagem = function (req,res) {
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
         var newpath = "./public/imagem/autor/" + imagem;
         fs.rename(oldpath,newpath,function (err) {
            if (err) {
              res.status(500).json(err);
            } else {
              var caminhoImagem = "/imagem/autor/" + imagem;
              dbAutor.update(id,{"caminhoImagem" : caminhoImagem})
              .then(val => {
                 var respostaImagem = {
                   "caminhoImagem" : caminhoImagem
                 }
                 respostaImagem._links = [
                   {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/autores"},
                   {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autores"},
                   {rel : "procurar", method: "GET", href: "http://" + req.headers.host + "/autores/" + id},
                   {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/autores/" + id}
                 ]
                 res.status(200).json(respostaImagem).end()
              }, err => {
                 res.status(500).json(err).end()
              })
            }
         });
     });
   };

   autor.listar = function (req,res) {
      dbAutor.all()
      .then(cursor => {
        cursor.all()
        .then(val => {
           var links = {
             _links : [
                 {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/autores"},
                 {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autores"}
             ]
           };
           val.push(links);
           res.status(200).json(val).end()
        })
      })
   };

   autor.listarAutor = function (req,res) {
      var id = req.params.id;
      dbAutor.document(id)
      .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/autores"},
           {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/autores/" + val._key},
           {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/autores/" + val._key}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   };

   autor.listarIdioma = function (req,res) {
      var id = req.params.id;
      db.query("FOR idioma IN idioma FOR autor IN autor FILTER autor._key == @id and autor.idIdioma == idioma._key RETURN idioma",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
            val._links = [
               {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + "/autores"},
               {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + "/autores"}
            ]
            res.status(200).json(val).end()
         })
      })
   };


   autor.avaliacao = function (req,res) {
      var id = req.params.id;
      db.query("FOR autor IN autor FOR licao IN licao FILTER autor._key == @id and licao.idAutor == autor._key COLLECT nomeAutor = autor.nomeAutor AGGREGATE md = SUM(licao.avaliacao), tt = length(licao) RETURN {'nomeAutor' : nomeAutor,'Media' : md/tt, 'Total' : tt}",{'id' : id})
      .then(cursor => {
        cursor.next()
        .then(val => {
          if(val==null) {
            val.Media = 0;
            val.Total = 0;
          }
          val._links = [
             {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + "/autores"},
             {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + "/autores"}
          ]
          res.status(200).json(val).end()
        })
      })
   };

   autor.ranking = async function (req,res) {
       db.query("FOR autor IN autor FOR licao IN licao FILTER licao.idAutor == autor._key COLLECT idAutor = autor._key, nomeAutor = autor.nomeAutor, caminhoImagem = autor.caminhoImagem AGGREGATE md = SUM(licao.avaliacao), tt = length(licao) RETURN {'nomeAutor' : nomeAutor, 'Media' : md/tt, 'Total' : tt, 'caminhoImagem' : caminhoImagem}")
       .then(cursor => {
          cursor.all()
          .then(val => {
             var links = {
               _links : [
                 {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + "/autores"},
                 {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + "/autores"}
               ]
             }
             val.push(links);
             res.status(200).json(val).end()
          })
       })
   };

  autor.editar = function (req,res) {
     var id = req.params.id;
     var dados = req.body;
     var result = Joi.validate(dados,model);
     if(result.error!=null) {
        res.status(400).json(result.error);
     } else {
        dbAutor.update(id,dados)
        .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/autor"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autor"},
             {rel : "procurar", method: "GET", href: "http://" + req.headers.host + "/autor/" + id},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/autor/" + id}
           ]
           res.status(200).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
     }
   };

   autor.deletar = function (req,res) {
      var id = req.params.id;
      dbAutor.remove(id)
      .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/autores"},
           {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autores"}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }

   return autor;
}
