module.exports = function (app) {
   var model = app.model.aluno;
   var Joi = app.get("joi");

   var aluno = {};

   aluno.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
         dados.caminhoImagem = "/imagem/usuario.jpg";
         dados.status = 1;
         var db = req.app.get("database");
         var aluno = db.collection("aluno");
         aluno.save(dados)
         .then(val => {
           val._links = [
             {rel : "procurar", method : "GET", href: "http://191.252.109.164/alunos/" + val._key},
             {rel : "atualizar", method : "PUT", href: "http://191.252.109.164/alunos/" + val._key},
             {rel : "excluir", method : "DELETE", href: "http://191.252.109.164/alunos/" + val._key}
           ]
            res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   aluno.listar = function (req,res) {
      var db = req.app.get("database");
      var aluno = db.collection("aluno");
      aluno.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   };

   aluno.listarAluno = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
     var aluno = db.collection("aluno");
     aluno.document(id)
     .then(val => {
        val._links = [
         {rel : "adicionar", method: "POST", href: "http://191.252.109.164/alunos"},
         {rel : "editar", method: "PUT", href: "http://191.252.109.164/alunos/" + val._key},
         {rel : "excluir", method: "DELETE", href: "http://191.252.109.164/alunos/" + val._key}
        ]
        res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     })
   };

   aluno.editar = function (req,res) {
     var id = req.params.id;
     var fs = app.get("fs");
     var formidable = app.get("formidable");
     var hasha = app.get("hasha");
     var path = app.get("path");

     var form = new formidable.IncomingForm();
     form.parse(req,function (err,fields,files) {
       var dados = fields;
       var result = Joi.validate(dados,model);
       if (result.error!=null) {
         res.status(400).json(result.error);
       } else {
         var oldpath = files.photo.path;
         var hash = hasha.fromFileSync(oldpath,{algorithm : "md5"});
         var tipo = path.extname(files.photo.name);
         var imagem = hash + tipo;
         var newpath = "./public/imagem/aluno/" + imagem;
         fs.rename(oldpath,newpath,function (err) {
            if (err) {
              res.status(500).json(err);
            } else {
              dados.caminhoImagem = "/imagem/aluno/" + imagem;
              var db = req.app.get("database");
              var aluno = db.collection("aluno");
              aluno.update(id,dados)
              .then(val => {
                 val._links = [
                   {rel : "adicionar", method: "POST", href: "http://191.252.109.164/alunos"},
                   {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
                   {rel : "procurar", method: "GET", href: "http://191.252.109.164/alunos/" + id},
                   {rel : "excluir", method: "DELETE", href: "http://191.252.109.164/alunos/" + id}
                 ]
                 res.status(200).json(val).end()
              }, err => {
                 res.status(500).json(err).end()
              })
            }
         });
       }
     });
   };

   aluno.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var aluno = db.collection("aluno");
      aluno.remove(id)
      .then(val => {
         val._links = [
          {rel : "adicionar", method: "POST", href: "http://191.252.109.164/alunos"},
          {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }

   return aluno;
}
