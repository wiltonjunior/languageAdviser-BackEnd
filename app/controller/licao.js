module.exports = function (app) {
   var model = app.model.licao;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbLicao = db.collection("licao");

   var licao = {};

   var versao = "/v1";

   licao.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
          dados.avaliacao = 0;
          dados.quantidadeVotos = 0;
          dbLicao.save(dados)
          .then(val => {
             val._links = [
               {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/licoes/" + val._key},
               {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/licoes/" + val._key},
               {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/licoes/" + val._key}
             ]
             res.status(201).json(val).end()
          }, err => {
             res.status(500).json(err).end()
          })
      }
   };

   licao.listar = function (req,res) {
      dbLicao.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            var links = {
              _links : [
                  {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
                  {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/licoes"}
              ]
            };
            val.push(links);
            res.status(200).json(val).end()
         })
      })
   };

   licao.listarLicao = function (req,res) {
      var id = req.params.id;
      dbLicao.document(id)
      .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
          {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/licoes/" + val._key},
          {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/licoes/" + val._key}
        ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   };

   licao.listarUsuario = function (req,res) {
      var id = req.params.id;
      db.query("FOR usuario IN usuario FOR licao IN licao FILTER licao._key == @id and licao.idUsuario == usuario._key RETURN usuario",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
           val._links = [
              {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
              {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/licoes"}
           ]
            res.status(200).json(val).end()
         })
      })
   };

   licao.listarIdioma = function (req,res) {
      var id = req.params.id;
      db.query("FOR idioma IN idioma FOR licao IN licao FILTER licao._key == @id and licao.idIdioma == idioma._key RETURN idioma",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
           val._links = [
              {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
              {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/licoes"}
           ]
           res.status(200).json(val).end()
         })
      })
   };

   licao.listarNivel = function (req,res) {
      var id = req.params.id;
      db.query("FOR nivel IN nivel FOR licao IN licao FILTER licao._key == @id and licao.idNivel == nivel._key RETURN nivel",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
            val._links = [
               {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
               {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/licoes"}
            ]
            res.status(200).json(val).end()
         })
      })
   };

   licao.listarSituacao = function (req,res) {
     var id = req.params.id;
     db.query("FOR situacao IN situacao FOR licao IN licao FILTER licao._key == @id and licao.idSituacao == situacao._key RETURN situacao",{'id' : id})
     .then(cursor => {
        cursor.next()
        .then(val => {
          val._links = [
             {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
             {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/licoes"}
          ]
          res.status(200).json(val).end()
        })
     })
   };

   licao.usuarios = function (req,res) {
      var idUsuario = req.params.idUsuario;
      db.query("FOR licao IN licao FILTER licao.idUsuario == @id RETURN licao",{'id' : idUsuario})
      .then(cursor => {
         cursor.all()
         .then(val => {
           var links = {
             _links : [
               {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
               {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/licoes"}
             ]
           };
           val.push(links);
           res.status(200).json(val).end()
         })
      })
   };

   licao.idiomas = function (req,res) {
     var idIdioma = req.params.idIdioma;
     db.query("FOR licao IN licao FILTER licao.idIdioma == @id RETURN licao",{'id' : idIdioma})
     .then(cursor => {
       cursor.all()
       .then(val => {
         var links = {
           _links : [
             {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
             {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/licoes"}
           ]
         };
         val.push(links);
         res.status(200).json(val).end()
       })
     })
   };

   licao.niveis = function (req,res) {
     var idNivel = req.params.idNivel;
     db.query("FOR licao IN licao FILTER licao.idNivel == @id RETURN licao",{'id' : idNivel})
     .then(cursor => {
        cursor.all()
        .then(val => {
          var links = {
            _links : [
              {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
              {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/licoes"}
            ]
          };
          val.push(links);
          res.status(200).json(val).end()
        })
     })
   };

   licao.situacoes = function (req,res) {
     var idSituacao = req.params.idSituacao;
     db.query("FOR licao IN licao FILTER licao.idSituacao == @id RETURN licao",{'id' : idSituacao})
     .then(cursor => {
        cursor.all()
        .then(val => {
          var links = {
            _links : [
              {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
              {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/licoes"}
            ]
          };
          val.push(links);
          res.status(200).json(val).end()
        })
     })
   };

   licao.selecionar = function (req,res) {
      var idIdioma = req.params.idIdioma;
      var idNivel = req.params.idNivel;
      var idSituacao = req.params.idSituacao;
      db.query("FOR licao IN licao FILTER licao.idIdioma == @idIdioma and licao.idNivel == @idNivel and licao.idSituacao == @idSituacao RETURN licao",{'idIdioma' : idIdioma,'idNivel' : idNivel, 'idSituacao' : idSituacao})
      .then(cursor => {
         cursor.all()
         .then(val => {
           var links = {
             _links : [
               {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
               {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/licoes"}
             ]
           }
           val.push(links);
           res.status(200).json(val).end()
         })
      })
   };

   licao.estudarLicao = function (req,res) {
      var idLicao = req.params.idLicao;
      var idUsuario = req.params.idUsuario;
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
         res.status(400).json(result.error).end()
      } else {
         dbLicao.update(id,dados)
         .then(val => {
            val._links = [
              {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/licoes"},
              {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/licoes/" + dados._key},
              {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/licoes"}
            ]
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   licao.editarVotos = function (req,res) {
      var dados = req.body;
      var aval = parseFloat(dados.avaliacao);
      db.query("FOR licao IN licao FILTER licao._key == @id RETURN licao",{'id' : dados.idLicao})
      .then(cursor => {
         cursor.next()
         .then(val => {
            if(val==null) {
               var resposta = {"mensagem" : "Lição não encontrada"};
               res.status(404).json(resposta);
            }
            else {
              var quantidade = val.quantidadeVotos + 1;
              var media = ((val.avaliacao * val.quantidadeVotos) + aval)/quantidade;
              val.avaliacao = media;
              val.quantidadeVotos = quantidade;
              var licao = db.collection("licao");
              licao.update(dados.idLicao,{'avaliacao' : val.avaliacao,'quantidadeVotos' : val.quantidadeVotos})
              .then(val => {
                val._links = [
                  {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
                  {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/licoes"},
                  {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/licoes/" + dados.idLicao},
                  {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/licoes"}
                ]
                res.status(200).json(val).end()
              }, err => {
                res.status(500).json(err).end()
              })
            }
         })
      })
   };

   licao.deletar = function (req,res) {
      var id = req.params.id;
      dbLicao.remove(id)
      .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/licoes"},
           {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/licoes"}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }

   return licao;
}
