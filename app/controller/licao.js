module.exports = function (app) {
   var model = app.model.licao;
   var Joi = app.get("joi");

   var licao = {};

   licao.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(500).json(result.error);
      } else {
          var db = req.app.get("database");
          var licao = db.collection("licao");
          licao.save(dados)
          .then(val => {
             res.status(201).json(val).end()
          }, err => {
             res.status(500).json(err).end()
          })
      }
   };

   licao.listar = function (req,res) {
      var db = req.app.get("database");
      var licao = db.collection("licao");
      licao.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   };

   licao.listarLicao = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var licao = db.collection("licao");
      licao.document(id)
      .then(val => {
         val._links = [
           {rel : "adicionar Conteudo", method : "POST", href : ""},
           {rel : "adicionar Autor", method: "POST", href : ""}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   };

   licao.listarAutor = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query("FOR autor IN autor FOR licao IN licao FILTER licao._key == @id and licao.idAutor == autor._key RETURN autor",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   };

   licao.listarConteudo = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query("FOR conteudo IN conteudo FOR licao IN licao FILTER licao._key == @id and licao.idConteudo == conteudo._key RETURN conteudo",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   }

   licao.estudarLicao = function (req,res) {
      var idLicao = req.params.idLicao;
      var idUsuario = req.params.idUsuario;
      var db = req.app.get("database");
      db.query("FOR licao IN licao FILTER licao._key == @id RETURN licao",{'id' : idLicao})
      .then(cursor => {
         cursor.next()
         .then(val => {
            var licao = val;
            db.query("FOR aluno IN aluno FILTER aluno._key == @id RETURN aluno",{'id' : idUsuario})
            .then(cursor => {
               cursor.next()
               .then(val => {
                  var aluno = val;
                  db.query("LET reg = (FOR regiao IN regiao FILTER regiao.localizacao == @pais or regiao.localizacao == @estado or regiao.localizacao == @cidade RETURN regiao._key) LET cont = (FOR contrato IN contrato FOR r IN reg FILTER contrato.idRegiao == r RETURN contrato) LET term = (FOR termo IN termos FOR c IN cont FILTER termo._key == c.idTermo or termo._key IN c.idTermo RETURN {'_key' : termo._key,'termo' : termo.termo,'termoTraducao' : termo.termoTraducao,'palavraChave' : c.palavraChave}) RETURN term",{'pais':aluno.pais,'estado':aluno.estado,'cidade':aluno.cidade})
                  .then(cursor => {
                     cursor.next()
                     .then(val => {
                        if (val!=null) {
                          for(var i = 0; i < val.length; i++) {
                             var palavra = val[i].termo;
                             var resultado = licao.texto.search(palavra);
                             if(resultado>0) {
                                var re = new RegExp(palavra,"g");
                                var textoFinal = licao.texto.replace(re,palavra + " " + val[i].palavraChave);
                                licao.texto = textoFinal;
                             }
                          }
                        }
                        res.status(200).json(licao);
                     })
                  })
               })
            })
         })
      })
   }

   licao.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(500).json(result.error).end()
      } else {
         var db = req.app.get("database");
         var licao = db.collection("licao");
         licao.update(id,dados)
         .then(val => {
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   licao.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var licao = db.collection("licao");
      licao.remove(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }

   return licao;
}
