module.exports = function (app) {
   var model = app.model.autor;
   var Joi = app.get("joi");

   var autor = {};

   autor.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
        res.status(400).json(result.error);
      } else {
        dados.caminhoImagem = "/imagem/usuario.jpg";
        dados.status = 2;
        var db = req.app.get("database");
        var autor = db.collection("autor");
        autor.save(dados)
        .then(val => {
           val._links = [
            {rel : "procurar", method : "GET", href: "http://191.252.109.164/autores/" + val._key},
            {rel : "atualizar", method : "PUT", href: "http://191.252.109.164/autores/" + val._key},
            {rel : "excluir", method : "DELETE", href: "http://191.252.109.164/autores/" + val._key}
           ]
           res.status(201).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
      }
   };

   autor.listar = function (req,res) {
      var db = req.app.get("database");
      var autor = db.collection("autor");
      autor.all()
      .then(cursor => {
        cursor.all()
        .then(val => {
           res.status(200).json(val).end()
        })
      })
   };

   autor.listarAutor = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var autor = db.collection("autor");
      autor.document(id)
      .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://191.252.109.164/autores"},
           {rel : "editar", method: "PUT", href: "http://191.252.109.164/autores/" + val._key},
           {rel : "excluir", method: "DELETE", href: "http://191.252.109.164/autores/" + val._key}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   };

   autor.listarIdioma = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query("FOR idioma IN idioma FOR autor IN autor FILTER autor._key == @id and autor.idIdioma == alunos._key RETURN idioma",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
            val._links = [
               {rel : "adicionar" ,method: "POST", href: "http://191.252.109.164/autores"},
               {rel : "listar" ,method: "GET", href: "http://191.252.109.164/autores"}
            ]
            res.status(200).json(val).end()
         })
      })
   };

   autor.editar = function (req,res) {
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
         var oldpath = files.imagem.path;
         var hash = hasha.fromFileSync(oldpath,{algorithm : "md5"});
         var tipo = path.extname(files.imagem.name);
         var imagem = hash + tipo;
         var newpath = "./public/imagem/autor/" + imagem;
         fs.rename(oldpath,newpath,function (err) {
            if (err) {
              res.status(500).json(err);
            } else {
              dados.caminhoImagem = "/imagem/autor/" + imagem;
              var db = req.app.get("database");
              var autor = db.collection("autor");
              autor.update(id,dados)
              .then(val => {
                 val._links = [
                   {rel : "adicionar", method: "POST", href: "http://191.252.109.164/autores"},
                   {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"},
                   {rel : "procurar", method: "GET", href: "http://191.252.109.164/autores/" + id},
                   {rel : "excluir", method: "DELETE", href: "http://191.252.109.164/autores/" + id}
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

   autor.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var autor = db.collection("autor");
      autor.remove(id)
      .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://191.252.109.164/autores"},
           {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }

   return autor;
}
