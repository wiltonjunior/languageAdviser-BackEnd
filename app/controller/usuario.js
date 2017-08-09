var googleMaps = require("@google/maps").createClient({
  key : "AIzaSyDIn5FpORLFp0zTqs1vyj4dpDEj04JFoXY"
});

module.exports = function (app) {
   var model = app.model.usuario;
   var Joi = app.get("joi");

   var usuario = {};

   usuario.salvar = function (req,res) {
     var dados = req.body;
     var db = req.app.get("database");
     db.query("FOR usuario IN usuario FILTER usuario._key == @id RETURN usuario",{'id' : dados._key})
     .then(cursor => {
        cursor.next()
        .then(val => {
           if (val==null) {
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
             var update = [];
             update.push(val.idIdioma);
             update.push(dados.idIdioma);
             dados.idIdioma = update;
             var usuario = db.collection("usuario");
             usuario.update(dados._key,dados)
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
      db.query("FOR aluno IN aluno FOR usuario IN usuario FILTER aluno.emailAluno == @email and aluno.senhaAluno == @senha and aluno._key == usuario._key RETURN {aluno,usuario}",{'email' : dados.email,'senha' : dados.senha})
      .then(cursor => {
         cursor.next()
         .then(val => {
            if(val==null) {
              db.query("FOR autor IN autor FOR usuario IN usuario FILTER autor.emailAutor == @email and autor.senhaAutor == @senha and autor._key == usuario._key RETURN {autor,usuario}",{'email' : dados.email,'senha' : dados.senha})
              .then(curosr => {
                 cursor.next()
                 .then(val => {
                    if (val==null) {
                      db.query("FOR administrador IN administrador FILTER administrador.emailAdministrador == @email and administrador.senhaAdministrador == @senha RETURN administrador",{'email' : dados.email,'senha' : dados.senha})
                      .then(cursor => {
                        cursor.next()
                        .then(val => {
                          if (val==null) {
                            var resposta = {'mensagem' : 'Usuário não encontrado'};
                             resposta._links = [
                               {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
                               {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"},
                               {rel : "listar", method: "GET", href: "http://191.252.109.164/administradores"}
                             ]
                             res.status(404).json(resposta);
                          } else {
                            val._links = [
                              {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
                              {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"},
                              {rel : "listar", method: "GET", href: "http://191.252.109.164/administradores"}
                            ]
                            res.status(200).json(val).end()
                          }
                        })
                      })
                    }
                    else {
                      val._links = [
                        {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
                        {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"},
                        {rel : "listar", method: "GET", href: "http://191.252.109.164/administradores"}
                      ]
                      res.status(200).json(val).end()
                    }
                 })
              })
            }
            else {
              if(dados.latitude==0&dados.longitude==0) {
                val._links = [
                  {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
                  {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"},
                  {rel : "listar", method: "GET", href: "http://191.252.109.164/administradores"}
                ]
                res.status(200).json(val).end()
              }
              else {
                var latitude = parseFloat(dados.latitude);
                var longitude = parseFloat(dados.longitude);
                googleMaps.reverseGeocode({
                  latlng : {lat: latidude, lng: longitude}
                }, function (err,res) {
                   if (err) {
                     val._links = [
                       {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
                       {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"},
                       {rel : "listar", method: "GET", href: "http://191.252.109.164/administradores"}
                     ]
                     res.status(200).json(val).end()
                   }
                   else {
                     var cidade;
                     var estado;
                     var pais;
                     for(var i = 0; i < res.json.results[0].address_components.length; i++) {
                        if (res.json.results[0].address_components[i].types[0] == "administrative_area_level_2") {
                           cidade = res.json.results[0].address_components[i].long_name;
                        }
                        if (res.json.results[0].address_components[i].types[0] == "administrative_area_level_1") {
                           estado = res.json.results[0].address_components[i].long_name;
                        }
                        if (res.json.results[0].address_components[i].types[0] == "country") {
                           pais = res.json.results[0].address_components[i].long_name;
                        }
                     }
                     val.aluno.pais = pais;
                     val.aluno.estado = estado;
                     val.aluno.cidade = cidade;
                     val._links = [
                       {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
                       {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"},
                       {rel : "listar", method: "GET", href: "http://191.252.109.164/administradores"}
                     ]
                     res.stauts(200).json(val).end()
                   }
                });
              }
           }
         })
      })
   };

   function google(latidude,longitude,val,res) {
     googleMaps.reverseGeocode({
       latlng : {lat: latidude, lng: longitude}
     }, function (err,res) {
        if (err) {
          val._links = [
            {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
            {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"},
            {rel : "listar", method: "GET", href: "http://191.252.109.164/administradores"}
          ]
          res.status(200).json(val).end()
        }
        else {
          var cidade;
          var estado;
          var pais;
          for(var i = 0; i < res.json.results[0].address_components.length; i++) {
             if (res.json.results[0].address_components[i].types[0] == "administrative_area_level_2") {
                cidade = res.json.results[0].address_components[i].long_name;
             }
             if (res.json.results[0].address_components[i].types[0] == "administrative_area_level_1") {
                estado = res.json.results[0].address_components[i].long_name;
             }
             if (res.json.results[0].address_components[i].types[0] == "country") {
                pais = res.json.results[0].address_components[i].long_name;
             }
          }
          val.aluno.pais = pais;
          val.aluno.estado = estado;
          val.aluno.cidade = cidade;
          val._links = [
            {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
            {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"},
            {rel : "listar", method: "GET", href: "http://191.252.109.164/administradores"}
          ]
          res.stauts(200).json(val).end()
        }
     })
   };

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

   usuario.listarUsuario = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
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
                        {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
                        {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"}
                      ]
                      res.status(404).json(resposta);
                   } else {
                      val._links = [
                        {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
                        {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"}
                      ]
                      res.status(200).json(val).end()
                   }
                })
             })
           } else {
             val._links = [
               {rel : "listar", method: "GET", href: "http://191.252.109.164/alunos"},
               {rel : "listar", method: "GET", href: "http://191.252.109.164/autores"}
             ]
             res.status(200).json(val).end()
           }
        })
     })
   };

   usuario.listarIdioma = function (req,res) {
      var id = req.params.id;
      var resposta;
      var db = req.app.get("database");
      db.query("LET usuario = (FOR usuario IN usuario FILTER usuario._key == @id RETURN usuario.idIdioma) FOR idioma IN idioma FOR u IN usuario FILTER idioma._key == u or idioma._key IN u RETURN idioma",{'id' : id})
      .then(cursor => {
         cursor.all()
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
