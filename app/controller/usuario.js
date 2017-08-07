module.exports = function (app) {
   var model = app.model.usuario;
   var Joi = app.get("joi");

   var usuario = {};

   usuario.salvar = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
     db.query("FOR usuario IN usuario FILTER usuario._key == @id RETURN usuario",{'id' : id})
     .then(cursor => {
        cursor.next()
        .then(val => {
           if (val==null) {
              var dados = req.body;
              var result = Joi.validate(dados,model);
              if (result.error!=null) {
                 res.status(400).json(result.error).end()
              } else {
                 var usuario = db.collection("usuario");
                 usuario.save(dados)
                 .then(val => {
                    val._links = [
                      {rel : "listar", method : "GET", href: "http://191.252.109.164/usuarios"},
                      {rel : "excluir", method : "DELETE", href: "http://191.252.109.164/usuarios/" + val._key}
                    ]
                    res.status(200).json(val).end()
                 }, err => {
                    res.status(500).json(err).end()
                 })
              }
           }
           else {
             var update = req.body;
             var idioma = [];
             idioma = update.idIdioma;
             idioma.push(id);
             update.idIdioma = idioma;
             var dados = update;
             var usuario = db.collection("usuario");
             usuario.update(id,dados)
             .then(val => {
                val._links = [
                  {rel : "listar", method : "GET", href: "http://191.252.109.164/usuarios"},
                  {rel : "excluir", method : "DELETE", href: "http://191.252.109.164/usuarios/" + val._key}
                ]
                res.status(200).json(val).end()
             }, err => {
                res.status(500).json(val).end()
             })
           }
        })
     })
   };

   usuario.login = function (req,res) {
      var dados = req.body;
      var db = req.app.get("database");
      db.query("FOR aluno IN aluno FILTER aluno.emailAluno == @email and aluno.senhaAluno == @senha RETURN aluno",{'email' : dados.email,'senha' : dados.senha})
      .then(cursor => {
         cursor.next()
         .then(val => {
            if(val==null) {
              db.query("FOR autor IN autor FILTER autor.emailAutor == @email and autor.senhaAutor == @senha RETURN autor",{'email' : dados.email,'senha' : dados.senha})
              .then(curosr => {
                 cursor.next()
                 .then(val => {
                    if (val==null) {
                       var resposta = {'mensagem' : 'Usuário não encontrado'};
                       resposta._links = [
                         {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
                         {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"}
                       ]
                       res.status(404).json(resposta);
                    }
                    else {
                       val._links = [
                         {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
                         {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"}
                       ]
                       res.status(200).json(val).end()
                    }
                 })
              })
            }
            else {
              val._links = [
                {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
                {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"}
              ]
              res.status(200).json(val).end()
            }
         })
      })
   }

  usuario.listar = function (req,res) {
      var db = req.app.get("database");
      var usuario = db.collection("usuario");
      usuario.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   };

   usuario.listarIdioma = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query("LET usuario = (FOR usuario IN usuario FILTER usuario.idUsuario == @id RETURN usuario.idIdioma) FOR idioma IN idioma FOR u IN usuario FILTER idioma._key == u or idioma._key IN u RETURN idioma")
      .then(cursor => {
         cursor.next()
         .then(val => {
            val._links = [
               {rel : "adicionar" ,method: "POST", href: "http://191.252.109.164/usuarios"},
               {rel : "listar" ,method: "GET", href: "http://191.252.109.164/usuarios"}
            ]
            res.status(200).json(val).end()
         })
      })
   };

   usuario.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var usuario = db.collection("usuario");
      usuario.remove(id)
      .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://191.252.109.164/usuarios"},
           {rel : "listar", method: "GET", href: "http://191.252.109.164/usuarios"}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }

   return usuario;
}
