module.exports = function (app) {
    var model = app.model.idioma;
    var Joi = app.get("joi");

    var idioma = {};

    idioma.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if(result.error!=null) {
         res.status(500).json(result.error);
      }
      else {
        var db = req.app.get("database");
        var idioma = db.collection("idioma");
        idioma.save(dados)
        .then(val => {
           res.status(201).json(val,[
             {rel : "procurar", method : "GET", href: "https://languageadviser.herokuapp.com/idioma/" + val._key},
             {rel : "atualizar", method : "PUT", href: "https://languageadviser.herokuapp.com/idioma/" + val._key},
             {rel : "excluir", method : "DELETE", href: "https://languageadviser.herokuapp.com/idioma/" + val._key}
           ]).end()
        }, err => {
           res.status(500).json(err).end()
        });
      }
    };

    idioma.teste = function (req,res) {
      var fs = app.get("fs");
      var formidable = app.get("formidable");
      var hasha = app.get("hasha");
      var path = app.get("path");

      var form = new formidable.IncomingForm();
      form.parse(req,function (err,fields,files) {
         var dados = fields;
         var result = Joi.validate(dados,model);
         if(result.error!=null) {
           res.status(500).json(result.error);
         }
         else {
             var oldpath = files.imagem.path;
             var hash = hasha.fromFileSync(oldpath,{algorithm : "md5"});
             var tipo = path.extname(files.imagem.name);
             var imagem = hash + tipo;
             var newpath = "./public/imagem/idioma/" + imagem;
             fs.rename(oldpath,newpath,function (err) {
                if(err) {
                  res.status(500).json(result.error);
                }
                else {
                  dados.caminhoImagem = "/imagem/idioma/" + imagem;
                  var db = app.get("database");
                  var idioma = db.collection("idioma");
                  idioma.save(dados)
                  .then(val => {
                    res.status(201).json(val,[
                      {rel : "procurar", method : "GET", href: "https://languageadviser.herokuapp.com/idioma/" + val._key},
                      {rel : "atualizar", method : "PUT", href: "https://languageadviser.herokuapp.com/idioma/" + val._key},
                      {rel : "excluir", method : "DELETE", href: "https://languageadviser.herokuapp.com/idioma/" + val._key}
                    ]).end()
                  }, err => {
                    res.status(500).json(err).end()
                  })
                }
            });
         }
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
         res.status(200).json(val,[
           {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/idioma"},
           {rel : "editar", method: "PUT", href: "https://languageadviser.herokuapp.com/idioma/" + val._key},
           {rel : "excluir", method: "DELETE", href: "https://languageadviser.herokuapp.com/idioma/" + val._key}
         ]).end()
       }, err => {
          res.status(500).json(err).end()
       });
    };

    idioma.editar = function (req,res) {
       var id = req.params.id;
       var dados = req.body;
       var result = Joi.validate(dados,model);
       if (result.error!=null) {
          res.status(500).json(result.error);
       } else {
          var db = req.app.get("database");
          var idioma = db.collection("idioma");
          idioma.update(id,dados)
          .then(val => {
            res.status(200).json(val,[
              {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/idioma"},
              {rel : "listar", method: "GET", href: "https://languageadviser.herokuapp.com/idioma"},
              {rel : "procurar", method: "GET", href: "https://languageadviser.herokuapp.com/idioma/" + id},
              {rel : "excluir", method: "DELETE", href: "https://languageadviser.herokuapp.com/idioma" + id}
            ]).end()
          }, err => {
             res.status(500).json(err).end()
          });
       }
    };

    idioma.deletar = function (req,res) {
       var id = req.params.id;
       var db = req.app.get("database");
       var idioma = db.collection("idioma");
       idioma.remove(id)
       .then(val => {
         res.status(200).json(val,[
           {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/idioma"},
           {rel : "listar", method: "GET", href: "https://languageadviser.herokuapp.com/idioma"}
         ]).end()
       }, err => {
          res.status(500).json(err).end()
       });
    }

    return idioma;
}
