module.exports = function (app) {
   var model = app.model.usuario;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbUsuario = db.collection("usuario");

   var usuario = {};

   usuario.salvar = function (req,res) {
      var dados = req.body;
      db.query("FOR usuario IN usuario FILTER usuario._key == @id RETURN usuario",{'id' : dados._key})
      .then(cursor => {
         cursor.next()
         .then(val => {
            if(val==null) {
              var result = Joi.validate(dados,model);
              if(result.error!=null) {
                res.status(400).json(result.error);
              }
              else {
                dbUsuario.save(dados)
                .then(val => {
                  val._links = [
                    {rel : "listar", method : "GET", href: "http://" + req.headers.host + "/usuarios"},
                    {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/usuarios/" + val._key}
                  ]
                  res.status(200).json(val).end()
                }, err => {
                  res.status(500).json(err).end()
                })
              }
            }
            else {
              var valor = Array.isArray(val.idIdioma);
              if(valor==true) {
                var update = [];
                var i;
                for(i=0;i<val.idIdioma;i++) {
                  update.push(val.idIdioma[i]);
                }
                update.push(dados.idIdioma);
                dados.idIdioma = update;
              }
              else {
                var update = [];
                update.push(val.idIdioma);
                update.push(dados.idIdioma);
                dados.idIdioma = update;
              }
              dbUsuario.update(dados._key,dados)
              .then(val => {
                 val._links = [
                   {rel : "listar", method : "GET", href: "http://" + req.headers.host + "/usuarios"},
                   {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/usuarios/" + val._key}
                 ]
                 res.status(200).json(val).end()
              }, err => {
                 res.status(500).json(err).end()
              })
            }
         })
      })
   };

   usuario.login = async function(req,res) {
      var dados = req.body;
      var aluno =  await alunoLogin(db,dados);
      if (aluno==null) {
         var autor = await autorLogin(db,dados);
         if(autor==null) {
           var administrador = await administradorLogin(db,dados);
           if (administrador==null) {
              var resposta = {"mensagem" : "Usuario não encontrado"};
              resposta._links = [
                {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"},
                {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autores"},
                {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/administradores"}
              ]
              res.status(404).json(resposta).end()
           }
           else {
             administrador._links = [
               {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"},
               {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autores"},
               {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/administradores"}
             ]
             res.status(200).json(administrador).end()
           }
         }
         else {
           var googleMaps = req.app.get("googleMaps");
           if(dados.latitude==0&&dados.longitude==0) {
             autor._links = [
               {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"},
               {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autores"},
               {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/administradores"}
             ]
             res.status(200).json(autor).end()
           }
           else {
             googleMaps.reverseGeocode({
               latlng : {lat: dados.latitude, lng: dados.longitude}
             }, function (err,result) {
                if (err) {
                   res.status(200).json(autor).end()
                }
                else {
                  var pais;
                  var estado;
                  var cidade;
                  for(var i = 0; i < result.json.results[0].address_components.length; i++) {
                     if (result.json.results[0].address_components[i].types[0] == "administrative_area_level_2") {
                        cidade = result.json.results[0].address_components[i].long_name;
                     }
                     if (result.json.results[0].address_components[i].types[0] == "administrative_area_level_1") {
                        estado = result.json.results[0].address_components[i].long_name;
                     }
                     if (result.json.results[0].address_components[i].types[0] == "country") {
                        pais = result.json.results[0].address_components[i].long_name;
                     }
                  }
                  if(autor.usuario!=null) {
                     autor.autor.pais = pais;
                     autor.autor.estado = estado;
                     autor.autor.cidade = cidade;
                  }
                  else {
                    autor.pais = pais;
                    autor.estado = estado;
                    autor.cidade = cidade;
                  }
                  autor._links = [
                    {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"},
                    {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autores"},
                    {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/administradores"}
                  ]
                  res.status(200).json(autor).end()
                }
             })
           }
         }
      }
      else {
        var googleMaps = req.app.get("googleMaps");
        if (dados.latitude==0&&dados.longitude==0) {
          aluno._links = [
            {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"},
            {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autores"},
            {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/administradores"}
          ]
          res.status(200).json(aluno).end()
        }
        else {
          googleMaps.reverseGeocode({
            latlng : {lat: dados.latitude, lng: dados.longitude}
          }, function (err,result) {
             if (err) {
                res.status(200).json(autor).end()
             }
             else {
               var pais;
               var estado;
               var cidade;
               for(var i = 0; i < result.json.results[0].address_components.length; i++) {
                  if (result.json.results[0].address_components[i].types[0] == "administrative_area_level_2") {
                     cidade = result.json.results[0].address_components[i].long_name;
                  }
                  if (result.json.results[0].address_components[i].types[0] == "administrative_area_level_1") {
                     estado = result.json.results[0].address_components[i].long_name;
                  }
                  if (result.json.results[0].address_components[i].types[0] == "country") {
                     pais = result.json.results[0].address_components[i].long_name;
                  }
               }
               if(aluno.usuario!=null) {
                 aluno.aluno.pais = pais;
                 aluno.aluno.estado = estado;
                 aluno.aluno.cidade = cidade;
               }
               else {
                 aluno.pais = pais;
                 aluno.estado = estado;
                 aluno.cidade = cidade;
               }
               aluno._links = [
                 {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"},
                 {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autores"},
                 {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/administradores"}
               ]
               res.status(200).json(aluno).end()
             }
          })
        }
      }
   };

   async function alunoLogin(db,dados) {
       var resultado = await db.query("FOR aluno IN aluno FOR usuario IN usuario FILTER aluno.emailAluno == @email and aluno.senhaAluno == @senha and aluno._key == usuario._key RETURN {aluno,usuario}",{'email' : dados.email,'senha' : dados.senha});
       if(resultado._result[0]==null) {
          resultado = await db.query("FOR aluno IN aluno FILTER aluno.emailAluno == @email and aluno.senhaAluno == @senha RETURN aluno",{'email' : dados.email,'senha' : dados.senha});
          return resultado._result[0];
       }
       else {
          var aluno = resultado._result[0];
          var valor = Array.isArray(aluno.usuario.idIdioma);
          if(valor==true) {
            var idioma = [];
            var i;
            for(i=0;i<aluno.usuario.idIdioma.length;i++) {
               var rtr = await db.query("FOR idioma IN idioma FILTER idioma._key == @id RETURN idioma",{'id' : aluno.usuario.idIdioma[i]});
               idioma.push(rtr._result[0]);
            }
            aluno.usuario.idIdioma = idioma;
            return aluno;
          }
          else {
            var idioma;
            idioma = await db.query("FOR idioma IN idioma FILTER idioma._key == @id RETURN idioma",{'id' : aluno.usuario.idIdioma});
            aluno.usuario.idIdioma = idioma._result[0];
            return aluno;
          }
       }
   };

   async function autorLogin(db,dados) {
      var resultado = await db.query("FOR autor IN autor FOR usuario IN usuario FILTER autor.emailAutor == @email and autor.senhaAutor == @senha and autor._key == usuario._key RETURN {autor,usuario}",{'email' : dados.email,'senha' : dados.senha});
      if (resultado._result[0]==null) {
         resultado = await db.query("FOR autor IN autor FILTER autor.emailAutor == @email and autor.senhaAutor == @senha RETURN autor",{'email' : dados.email,'senha' : dados.senha});
         return resultado._result[0];
      }
      else {
        var autor = resultado._result[0];
        var valor = Array.isArray(autor.usuario.idIdioma);
        if(valor==true) {
          var idioma = [];
          var i;
          for(i=0;i<autor.usuario.idIdioma.length;i++) {
             var rtr = await db.query("FOR idioma IN idioma FILTER idioma._key == @id RETURN idioma",{'id' : autor.usuario.idIdioma[i]});
             idioma.push(rtr._result[0]);
          }
          autor.usuario.idIdioma = idioma;
          return autor;
        }
        else {
          var idioma;
          idioma = await db.query("FOR idioma IN idioma FILTER idioma._key == @id RETURN idioma",{'id' : autor.usuario.idIdioma});
          autor.usuario.idIdioma = idioma._result[0];
          return autor;
        }
      }
   };

   async function administradorLogin(db,dados) {
     var resultado = await db.query("FOR administrador IN administrador FILTER administrador.emailAdministrador == @email and administrador.senhaAdministrador == @senha RETURN administrador",{'email' : dados.email,'senha' : dados.senha});
     return resultado._result[0];
   };

  usuario.listar = function (req,res) {
      dbUsuario.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            var links = {
              _links : [
                   {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + "/usuarios"},
                   {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + "/usuarios"}
              ]
            };
            val.push(links);
            res.status(200).json(val).end()
         })
      })
   };

   usuario.listarUsuario = function (req,res) {
     var id = req.params.id;
     db.query("FOR aluno IN aluno FILTER aluno._key == @id RETURN aluno",{'id' : id})
     .then(cursor => {
        cursor.next()
        .then(val => {
           if (val==null) {
             db.query("FOR autor IN autor FILTER autor._key == @id RETURN autor",{'id' : id})
             .then(cursor => {
                cursor.next()
                .then(val => {
                   if (val==null) {
                      var resposta = {'mensagem' : 'Usuário não encontrado'};
                      resposta._links = [
                        {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"},
                        {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autores"}
                      ]
                      res.status(404).json(resposta);
                   } else {
                      val._links = [
                        {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"},
                        {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autores"}
                      ]
                      res.status(200).json(val).end()
                   }
                })
             })
           } else {
             val._links = [
               {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/alunos"},
               {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/autores"}
             ]
             res.status(200).json(val).end()
           }
        })
     })
   };

   usuario.listarIdioma = function (req,res) {
      var id = req.params.id;
      var resposta;
      db.query("LET usuario = (FOR usuario IN usuario FILTER usuario._key == @id RETURN usuario.idIdioma) FOR idioma IN idioma FOR u IN usuario FILTER idioma._key == u or idioma._key IN u RETURN idioma",{'id' : id})
      .then(cursor => {
         cursor.all()
         .then(val => {
            var links = {
              _links : [
                {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + "/usuarios"},
                {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + "/usuarios"}
              ]
            };
            val.push(links);
            res.status(200).json(val).end()
         })
      })
   };
   
   usuario.deletar = function (req,res) {
      var id = req.params.id;
      dbUsuario.remove(id)
      .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/usuarios"},
           {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/usuarios"}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }

   return usuario;
}
