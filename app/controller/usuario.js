module.exports = function (app) {
   var model = app.model.usuario;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbUsuario = db.collection("usuario");

   var cache = app.get("cache");

   var usuario = {};

   var versao = "/v1";

   usuario.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);

      if(result.error!=null) {
        res.status(404).json(result.error);
      }
      else {
        dados.caminhoImagem = "/imagem/usuario.jpg";
        dados.status = 1;
        dbUsuario.save(dados)
        .then(val => {
           val._links = [
             {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/usuarios/" + val._key},
             {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/usuarios/" + val._key},
             {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/usuarios/" + val._key}
           ]
           res.status(201).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
      }
   };

   usuario.imagem = function (req,res) {
     var id = req.params.id;
     var fs = app.get("fs");
     var formidable = app.get("formidable");
     var hasha = app.get("hasha");
     var path = app.get("path");

     var form = new formidable.IncomingForm();
     form.parse(req,function (err,fields,files) {
        var oldpath = files.photo.path;
        var hash = hasha.fromFileSync(oldpath,{algorithm : "md5"});
        var tipo = path.extname(files.photo.name);
        var imagem = hash + tipo;
        var newpath = "./public/imagem/usuario/" + imagem;
        fs.rename(oldpath,newpath,function (err) {
           if(err) {
              res.status(500).json(err);
           }
           else {
              var caminhoImagem = "/imagem/usuario/" + imagem;
              dbUsuario.update(id,{'caminhoImagem' : caminhoImagem})
              .then(val => {
                 var respostaImagem = {
                   "caminhoImagem" : caminhoImagem
                 }
                 respostaImagem._links = [
                   {rel : "adicionar", method: "POST", href:"http://" + req.headers.host + versao + "/usuarios"},
                   {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/usuarios"},
                   {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/usuarios/" + id},
                   {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/usuarios/" + id}
                 ]
                 res.status(200).json(respostaImagem).end()
              }, err => {
                 res.status(500).json(err).end()
              })
           }
        });
     });
   };

   usuario.listar = function (req,res) {
      var resultado = cache.get("listarUsuario");
      if(resultado==undefined) {
        dbUsuario.all()
        .then(cursor => {
           cursor.all()
           .then(val => {
              var links = {
                _links : [
                  {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/usuarios"},
                  {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/usuarios"}
                ]
              }
              val.push(links);
              cache.set("listarUsuario",val,10);
              res.status(200).json(val).end()
           })
        })
      }
      else {
         res.status(200).json(resultado).end()
      }
   };

   usuario.listarUsuario = function (req,res) {
      var id = req.params.id;
      var nomeCache = "listarUsuario" + id;
      var resultado = cache.get(nomeCache);
      if (resultado==undefined) {
        dbUsuario.document(id)
        .then(val => {
           val.links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/usuarios"},
             {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/usuarios/" + val._key},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/usuarios/" + val._key}
           ]
           cache.set(nomeCache,val,20);
           res.status(200).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
      }
      else {
         res.status(200).json(resultado).end()
      }
   };

   usuario.avaliacao = function (req,res) {
      var id = req.params.id;
      var nomeCache = "listarUsuarioAvaliacao" + id;
      var resultado = cache.get(nomeCache);
      if(resultado==undefined) {
        db.query("FOR usuario IN usuario FOR licao IN licao FILTER usuario._key == @id and licao.idUsuario == usuario._key COLLECT nomeUsuario = usuario.nomeUsuario AGGREGATE md = SUM(licao.avaliacao), tt = length(licao) RETURN {'nomeUsuario' : nomeUsuario,'Media' : md/tt, 'Total' : tt}",{'id' : id})
        .then(cursor => {
           cursor.next()
           .then(val => {
              if(val==null) {
                 val = {
                    "Media" : 0,
                    "Total" : 0
                 }
              }
              val.links = [
                {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/usuarios"},
                {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/usuarios"}
              ]
              cache.set(nomeCache,val,10);
              res.status(200).json(val).end()
           })
        })
      }
      else {
         res.status(200).json(resultado).end()
      }
   };

   usuario.ranking = function (req,res) {
      var resultado = cache.get("listarUsuarioRanking");
      if(resultado==undefined) {
        db.query("FOR usuario IN usuario FOR licao IN licao FILTER licao.idUsuario == usuario._key COLLECT idUsuario = usuario._key, nomeUsuario = usuario.nomeUsuario, caminhoImagem = usuario.caminhoImagem AGGREGATE md = SUM(licao.avaliacao), tt = length(licao) RETURN {'nomeUsuario' : nomeUsuario, 'Media' : md/tt, 'Total' : tt, 'caminhoImagem' : caminhoImagem}")
        .then(cursor => {
           cursor.all()
           .then(val => {
              var links = {
                 _links : [
                   {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/usuarios"},
                   {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/usuarios"}
                 ]
              }
              val.push(links);
              cache.set("listarUsuarioRanking",val,10);
              res.status(200).json(val).end()
           })
        })
      }
      else {
         res.status(200).json(resultado).end()
      }
   };

   usuario.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);

      if(result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         dbUsuario.update(id,dados)
         .then(val => {
            val.links = [
              {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/usuarios"},
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/usuarios"},
              {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/usuarios/" + id},
              {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/usuarios/" + id}
            ]
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   usuario.deletar = function (req,res) {
      var id = req.params.id;
      dbUsuario.remove(id)
      .then(val => {
         val.links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/usuarios"},
           {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/usuarios"}
         ]
         res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      })
   }


   return usuario;

}
