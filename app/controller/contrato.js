module.exports = function (app) {
   var model = app.model.contrato;
   var Joi = app.get("joi");

   var contrato = {};

   contrato.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(500).json(result.error);
      } else {
         var db = req.app.get("database");
         db.query("LET cont = (FOR contrato IN contrato FILTER contrato.idRegiao == @id RETURN contrato) RETURN length(cont)",{'id' : dados.idRegiao})
         .then(cursor => {
            cursor.next()
            .then(val => {
               if(val!=0) {
                  db.query("LET cont = (FOR contrato IN contrato FILTER contrato.idRegiao == @id RETURN contrato) LET contrato = (FOR c IN cont FILTER c.idTermo ANY IN @termos or c.idTermo ANY == @termos or c.idTermo == @termos or c.idTermo IN @termos RETURN c) RETURN length(contrato)",{'id' : dados.idRegiao,'termos' : dados.idTermo})
                  .then(cursor => {
                     cursor.next()
                     .then(val => {
                        if(val!=0) {
                           var resposta = {'mensagem' : 'Contrato com termos parecidos já existe'};
                           res.status(501).json(resposta);
                        }
                        else {
                           var contrato = db.collection("contrato");
                           contrato.save(dados)
                           .then(val => {
                             res.status(201).json(val,[
                               {rel : "procurar", method : "GET", href: "https://languageadviser.herokuapp.com/contrato/" + val._key},
                               {rel : "atualizar", method : "PUT", href: "https://languageadviser.herokuapp.com/contrato/" + val._key},
                               {rel : "excluir", method : "DELETE", href: "https://languageadviser.herokuapp.com/contrato/" + val._key}
                             ]).end()
                           }, err => {
                              res.status(500).json(err).end()
                           })
                        }
                     })
                  })
               }
               else {
                 var contrato = db.collection("contrato");
                 contrato.save(dados)
                 .then(val => {
                   res.status(201).json(val,[
                     {rel : "procurar", method : "GET", href: "https://languageadviser.herokuapp.com/contrato/" + val._key},
                     {rel : "atualizar", method : "PUT", href: "https://languageadviser.herokuapp.com/contrato/" + val._key},
                     {rel : "excluir", method : "DELETE", href: "https://languageadviser.herokuapp.com/contrato/" + val._key}
                   ]).end()
                 }, err => {
                     res.status(500).json(err).end()
                 })
               }
            })
         })
      }
   };

   contrato.listar = function (req,res) {
      var db = req.app.get("database");
      var contrato = db.collection("contrato");
      contrato.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
           res.status(200).json(val).end()
         });
      });
   };

   contrato.listarContrato = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var contrato = db.collection("contrato");
      contrato.document(id)
      .then(val => {
        res.status(200).json(val,[
          {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/contrato"},
          {rel : "empresa", method: "GET", href: "https://languageadviser.herokuapp.com/contrato/empresa/" + val._key},
          {rel : "termos", method: "GET", href: "https://languageadviser.herokuapp.com/contrato/termos/" + val._key},
          {rel : "regiao", method: "GET", href: "https://languageadviser.herokuapp.com/contrato/regiao/" + val._key},
          {rel : "editar", method: "PUT", href: "https://languageadviser.herokuapp.com/contrato/" + val._key},
          {rel : "excluir", method: "DELETE", href: "https://languageadviser.herokuapp.com/contrato/" + val._key}
        ]).end()
      }, err => {
         res.status(500).json(err).end()
      });
   };

   contrato.listarEmpresa = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query("FOR empresa IN empresa FOR contrato IN contrato FILTER contrato._key == @id and contrato.idEmpresa == empresa._key RETURN empresa",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
           res.status(200).json(val,[
             {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/contrato"},
             {rel : "listar", method: "GET", href: "https://languageadviser.herokuapp.com/contrato"},
             {rel : "editar", method: "PUT", href: "https://languageadviser.herokuapp.com/contrato/" + id},
             {rel : "excluir", method: "DELETE", href: "https://languageadviser.herokuapp.com/contrato/" + id}
           ]).end();
         });
      });
   };

   contrato.listarTermos = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query("FOR termos IN termos FOR contrato IN contrato FILTER contrato._key == @id and contrato.idTermo == termos._key RETURN termos",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
           res.status(200).json(val,[
             {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/contrato"},
             {rel : "listar", method: "GET", href: "https://languageadviser.herokuapp.com/contrato"},
             {rel : "editar", method: "PUT", href: "https://languageadviser.herokuapp.com/contrato/" + id},
             {rel : "excluir", method: "DELETE", href: "https://languageadviser.herokuapp.com/contrato/" + id}
           ]).end();
         });
      });
   };

   contrato.listarRegiao = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query("FOR regiao IN regiao FOR contrato IN contrato FILTER contrato._key == @id and contrato.idRegiao == regiao._key RETURN regiao",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
           res.status(200).json(val,[
             {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/contrato"},
             {rel : "listar", method: "GET", href: "https://languageadviser.herokuapp.com/contrato"},
             {rel : "editar", method: "PUT", href: "https://languageadviser.herokuapp.com/contrato/" + id},
             {rel : "excluir", method: "DELETE", href: "https://languageadviser.herokuapp.com/contrato/" + id}
           ]).end();
         });
      });
   };

   contrato.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(501).json(result.error);
      } else {
         var db = req.app.get("database");
         var contrato = db.collection("contrato");
         contrato.update(id,dados)
         .then(val => {
           res.status(200).json(val,[
             {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/contrato"},
             {rel : "listar", method: "GET", href: "https://languageadviser.herokuapp.com/contrato"},
             {rel : "procurar", method: "GET", href: "https://languageadviser.herokuapp.com/contrato/" + id},
             {rel : "excluir", method: "DELETE", href: "https://languageadviser.herokuapp.com/contrato" + id}
           ]).end()
         }, err => {
            res.status(500).json(err).end()
         });
      }
   };

   contrato.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var contrato = db.collection("contrato");
      contrato.remove(id)
      .then(val => {
        res.status(200).json(val,[
          {rel : "adicionar", method: "POST", href: "https://languageadviser.herokuapp.com/contrato"},
          {rel : "listar", method: "GET", href: "https://languageadviser.herokuapp.com/contrato"}
        ]).end()
      }, err => {
         res.status(500).json(err).end()
      });
   };


   return contrato;
}
