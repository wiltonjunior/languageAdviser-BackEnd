module.exports = function (app) {
   var model = app.model.aluno;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbAluno = db.collection("aluno");

   var aluno = {};

   aluno.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
         dados.caminhoImagem = "/imagem/usuario.jpg";
         dados.status = 1;
         dbAluno.save(dados)
         .then(val => {
           val._links = [
             {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/alunos/" + val._key},
             {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/alunos/" + val._key},
             {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/alunos/" + val._key}
           ]
            res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   aluno.imagem = function (req,res) {
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
         var newpath = "./public/imagem/aluno/" + imagem;
         fs.rename(oldpath,newpath,function (err) {
            if (err) {
              res.status(500).json(err);
            } else {
              var caminhoImagem = "/imagem/aluno/" + imagem;
              dbAluno.update(id,{"caminhoImagem" : caminhoImagem})
              .then(val => {
                 var respostaImagem = {
                   "caminhoImagem" : caminhoImagem
                 }
                 respostaImagem._links = [
                   {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/alunos"},
                   {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"},
                   {rel : "procurar", method: "GET", href: "http://" + req.headers.host + "/alunos/" + id},
                   {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/alunos/" + id}
                 ]
                 res.status(200).json(respostaImagem).end()
              }, err => {
                 res.status(500).json(err).end()
              })
            }
         });
     });
   };

   aluno.listar = function (req,res) {
      dbAluno.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            var links = {
              _links : [
               {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/alunos"},
               {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"}
              ]
            };
            val.push(links);
            res.status(200).json(val).end()
         })
      })
   };

   aluno.listarAluno = function (req,res) {
     var id = req.params.id;
     dbAluno.document(id)
     .then(val => {
        val._links = [
         {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/alunos"},
         {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/alunos/" + val._key},
         {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/alunos/" + val._key}
        ]
        res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     })
   };

   aluno.editar = function (req,res) {
     var id = req.params.id;
     var dados = req.body;
     var result = Joi.validate(dados,model);
     if(result.error!=null) {
        res.status(400).json(result.error);
     } else {
        dbAluno.update(id,dados)
        .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/alunos"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"},
             {rel : "procurar", method: "GET", href: "http://" + req.headers.host + "/alunos/" + id},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/alunos/" + id}
           ]
           res.status(200).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
     }
   };

   aluno.deletar = function (req,res) {
      var id = req.params.id;
      dbAluno.remove(id)
      .then(val => {
         val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/alunos"},
          {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }

   return aluno;
}
