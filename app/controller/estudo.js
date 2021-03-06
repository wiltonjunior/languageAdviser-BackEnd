module.exports = function (app) {
   var model = app.model.estudo;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbEstudo = db.collection("estudo");

   var cache = app.get("cache");

   var estudo = {};

   var versao = "/v1";


   estudo.salvar = function (req,res) {
       var dados = req.body;
       var result = Joi.validate(dados,model);
       if(result.error!=null) {
         res.status(400).json(result.error);
       }
       else {
         db.query("FOR estudo IN estudo FILTER estudo._key == @id RETURN estudo",{'id' : dados._key})
         .then(cursor => {
           cursor.next()
           .then(val => {
              if(val==null) {
                dbEstudo.save(dados)
                .then(val => {
                  val._links = [
                     {rel : "listar", method : "GET", href: "http://" + req.headers.host + versao + "/estudos"},
                     {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/estudos/" + val._key}
                   ]
                   res.status(201).json(val).end()
                }, err => {
                   res.status(500).json(err).end()
                })
              }

           })
         })
       }
       db.query("FOR estudo IN estudo FILTER estudo._key == @id RETURN estudo",{'id' : dados._key})
       .then(cursor => {
          cursor.next()
          .then(val => {
             if(val==null) {
              var result = Joi.validate(dados,model);
               if(result.error!=null) {
                  console.log(result.error);
               }
               else {
                 dbEstudo.save(dados)
                 .then(val => {
                    val._links = [
                       {rel : "listar", method : "GET", href: "http://" + req.headers.host + versao + "/estudos"},
                       {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/estudos/" + val._key}
                     ]
                     res.status(201).json(val).end()
                   }, err => {
                     res.status(500).json(err).end()
                 })
               }
             }
             else {
               var valor = Array.isArray(val.idIdioma);
               if(valor==true) {
                 var pos = val.idIdioma.indexOf(dados.idIdioma);
                 if(pos>=0) {
                    var resposta = {"mensagem" : "Idioma já esta sendo estudado"};
                    res.status(409).json(resposta);
                 }
                 else {
                   var update = [];
                   var i;
                   for(i=0;i<val.idIdioma.length;i++) {
                     update.push(val.idIdioma[i]);
                   }
                   update.push(dados.idIdioma);
                   dados.idIdioma = update;
                   dbEstudo.update(dados._key,dados)
                   .then(val => {
                      val._links = [
                        {rel : "listar", method : "GET", href: "http://" + req.headers.host + versao + "/estudos"},
                        {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/estudos/" + val._key}
                      ]
                      res.status(200).json(val).end()
                   }, err => {
                      res.status(500).json(err).end()
                   })
                 }
               }
               else {
                 if(val.idIdioma==dados.idIdioma) {
                    var resposta = {"mensagem" : "Idioma já esta sendo estudado"};
                    res.status(409).json(resposta);
                 }
                 else {
                   var update = [];
                   update.push(val.idIdioma);
                   update.push(dados.idIdioma);
                   dados.idIdioma = update;
                   dbEstudo.update(dados._key,dados)
                   .then(val => {
                      val._links = [
                        {rel : "listar", method : "GET", href: "http://" + req.headers.host + versao + "/estudos"},
                        {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/estudos/" + val._key}
                      ]
                      res.status(200).json(val).end()
                   }, err => {
                      res.status(500).json(err).end()
                   })
                 }
               }
             }
          })
       })
   };

   estudo.listar = function (req,res) {
      var resultado = cache.get("listarEstudo");
      if(resultado==undefined) {
        dbEstudo.all()
        .then(cursor => {
           cursor.all()
           .then(val => {
              var links = {
                _links : [
                  {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/estudos"},
                  {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/estudos"}
                ]
              }
              val.push(links);
              cache.set("listarEstudo",val,10);
              res.status(200).json(val).end()
           })
        })
      }
      else {
        res.status(200).json(resultado).end()
      }
   };

   estudo.listarUsuario = function (req,res) {
      var id = req.params.id;
      var nomeCache = "listarEstudoUsuario" + id;
      var resultado = cache.get(nomeCache);
      if(resultado==undefined) {
        db.query("FOR estudo IN estudo FOR usuario IN usuario FILTER estudo._key == usuario.key RETURN usuario")
        .then(cursor => {
           cursor.next()
           .then(val => {
              val.links = [
                {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/estudos"},
                {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/estudos"}
              ]
              cache.set(nomeCache,val,20);
              res.status(200).json(val).end()
           })
        })
      }
      else {
        res.status(200).json(resultado).end()
      }
   };

   estudo.listarIdioma = function (req,res) {
      var id = req.params.id;
      var nomeCache = "listarEstudoIdioma" + id;
      var resultado = cache.get(nomeCache);
      if(resultado==undefined) {
        db.query("LET estudo = (FOR estudo IN estudo FILTER estudo._key == @id RETURN estudo.idIdioma) FOR idioma IN idioma FOR est IN estudo FILTER idioma._key == est or idioma._key IN est RETURN idioma",{'id' : id})
        .then(cursor => {
           cursor.all()
           .then(val => {
              var links = {
                 _links : [
                   {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/estudos"},
                   {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/estudos"}
                 ]
              }
              val.push(links);
              cache.set(nomeCache,val,20);
              res.status(200).json(val).end()
           })
        })
      }
      else {
        res.status(200).json(resultado).end()
      }
   };

   estudo.editar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         db.query("FOR estudo IN estudo FILTER estudo._key == @id RETURN estudo",{'id' : dados._key})
         .then(cursor => {
            cursor.next()
            .then(val => {
               var valor = Array.isArray(val.idIdioma);
               if (valor==true) {
                  var pos = val.idIdioma.indexOf(dados.idIdioma);
                  if(pos>=0) {
                    var update = [];
                    var i;
                    for(i=0;i<val.idIdioma.length;i++) {
                       update.push(val.idIdioma[i]);
                    }
                    update.splice(pos,1);
                    if(update.length==1) {
                       dados.idIdioma = update[0];
                    }
                    else {
                       dados.idIdioma = update;
                    }
                    dbEstudo.update(dados._key,{'idIdioma' : dados.idIdioma})
                    .then(val => {
                       val._links = [
                         {rel : "listar", method : "GET", href: "http://" + req.headers.host + versao + "/estudos"},
                         {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/estudos/" + val._key}
                       ]
                       res.status(200).json(val).end()
                    }, err => {
                       res.status(500).json(err).end()
                    })
                  }
                  else {
                     var resposta = {"mensagem" : "Idioma não está sendo estudado"};
                     res.status(404).json(resposta);
                  }
               }
               else {
                 if(val.idIdioma == dados.idIdioma) {
                    dbEstudo.remove(dados._key)
                    .then(val => {
                       val._links = [
                         {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/estudos"},
                         {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/estudos"}
                       ]
                       res.status(200).json(val).end()
                    }, err => {
                       res.status(500).json(err).end()
                    })
                 }
                 else {
                    var resposta = {"mensagem" : "Idioma não está sendo estudado"};
                    res.status(404).json(resposta);
                 }
               }
            })
         })
      }
   };

   estudo.deletar = function (req,res) {
      var id = req.params.id;
      dbEstudo.remove(id)
      .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/estudos"},
           {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/estudos"}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }


   return estudo;

}
