module.exports = function (app) {
   var model = app.model.dialogo;
   var Joi = app.get("joi");

   var dialogo = {};

   dialogo.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error)
      } else {
         var db = req.app.get("database");
         var dialogo = db.collection("dialogo");
         dialogo.save(dados)
         .then(val => {
            val._links = [
              {rel : "procurar", method : "GET", href: "http://191.252.109.164/dialogos/" + val._key},
              {rel : "atualizar", method : "PUT", href: "http://191.252.109.164/dialogos/" + val._key},
              {rel : "excluir", method : "DELETE", href: "http://191.252.109.164/dialogos/" + val._key}
            ]
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   dialogo.listar = function (req,res) {
      var db = req.app.get("database");
      var dialogo = db.collection("dialogo");
      dialogo.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   };

   dialogo.listarDialogo = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var dialogo = db.collection("dialogo");
      dialogo.document(id)
      .then(cursor => {
         cursor.next()
         .then(val => {
            val._links = [
              {rel : "adicionar" ,method: "POST", href: "http://191.252.109.164/dialogos"},
              {rel : "listar" ,method: "GET", href: "http://191.252.109.164/dialogos"}
            ]
            res.status(200).json(val).end()
         })
      })
   };

   dialogo.listarLicao = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
     db.query("FOR licao IN licao FOR dialogo IN dialogo FILTER dialogo._key == @id and dialogo.idLicao == licao._key RETURN licao",{'id' : id})
     .then(cursor => {
        cursor.next()
        .then(val => {
           val._links = [
             {rel : "adicionar" ,method: "POST", href: "http://191.252.109.164/dialogos"},
             {rel : "listar" ,method: "GET", href: "http://191.252.109.164/dialogos"}
           ]
           res.status(200).json(val).end()
        })
     })
   };

   dialogo.estudar = function (req,res) {
     var idDialogo = req.params.idDialogo;
     var idUsuario = req.params.idUsuario;
     var db = req.app.get("database");

     db.query("FOR dialogo IN dialogo FILTER dialogo._key == @id RETURN dialogo",{'id' : idDialogo})
     .then(cursor => {
        cursor.next()
        .then(val => {
           var dialogo = val;
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
                            var palavra = val[i].termoTraducao;
                            var resultado = dialogo.texto.search(palavra);
                            if(resultado>0) {
                               var re = new RegExp(palavra,"g");
                               var textoFinal = dialogo.texto.replace(re,palavra + " " + val[i].palavraChave);
                               dialogo.texto = textoFinal;
                            }
                         }
                       }
                       res.status(200).json(dialogo);
                    });
                 });
              });
           });
        });
     });
   };
   
   dialogo.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error) {
        res.status(400).json(result.error);
      } else {
        var db = req.app.get("database");
        var dialogo = db.collection("dialogo");
        dialogo.update(id,dados)
        .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://191.252.109.164/dialogos"},
             {rel : "listar", method: "GET", href: "http://191.252.109.164/dialogos"},
             {rel : "procurar", method: "GET", href: "http://191.252.109.164/dialogos/" + id},
             {rel : "excluir", method: "DELETE", href: "http://191.252.109.164/dialogos/" + id}
           ]
           res.status(200).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
      }
   };

   dialogo.deletar = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
     var dialogo = db.collection("dialogo");
     dialogo.remove(id)
     .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://191.252.109.164/dialogos"},
          {rel : "listar", method: "GET", href: "http://191.252.109.164/dialogos"}
        ]
        res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     })
   }

   return dialogo;
}
