module.exports = function (app) {
   var model = app.model.nivel;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbNivel = db.collection("nivel");

   var nivel = {};

   nivel.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
         dbNivel.save(dados)
         .then(val => {
            val._links = [
              {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/niveis/" + val._key},
              {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/niveis/" + val._key},
              {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/niveis/" + val._key}
            ]
            res.status(201).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   nivel.listar = function (req,res) {
     dbNivel.all()
     .then(cursor => {
        cursor.all()
        .then(val => {
           var links = {
             _links : [
                 {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/niveis"},
                 {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/niveis"}
             ]
           };
           val.push(links);
           res.status(200).json(val).end()
        })
     })
   };

   nivel.listarNivel = function (req,res) {
     var id = req.params.id;
     dbNivel.document(id)
     .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/niveis"},
          {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/niveis/" + val._key},
          {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/niveis/" + val._key}
        ]
        res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     })
   };

   nivel.editar = function (req,res) {
     var id = req.params.id;
     var dados = req.body;
     var result = Joi.validate(dados,model);
     if (result.error!=null) {
       res.status(400).json(result.error);
     }
     else {
       dbNivel.update(id,dados)
       .then(val => {
         val._links = [
           {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/niveis"},
           {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/niveis"},
           {rel : "procurar", method: "GET", href: "http://" + req.headers.host + "/niveis/" + id},
           {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/niveis/" + id}
         ]
         res.status(200).json(val).end()
       }, err => {
         res.status(500).json(err).end()
       })
     }
   };

   nivel.deletar = function (req,res) {
     var id = req.params.id;
     dbNivel.remove(id)
     .then(val => {
       val._links = [
         {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/niveis"},
         {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/niveis"}
       ]
       res.status(200).json(val).end()
     }, err => {
       res.status(500).json(err).end()
     })
   }



   return nivel;

}
