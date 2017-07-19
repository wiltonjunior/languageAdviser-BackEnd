module.exports = function (app) {
   var model = app.model.contrato;
   var Joi = app.get("joi");

   var contrato = {};

   contrato.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(501).json(result.error);
      } else {
         var db = req.app.get("database");
         if(verificarRegiao(db,dados.idRegiao)!=0){
            var resposta = {"mensagem" : "Região com contrato já existente"};
            res.status(501).json(resposta);
         }
         else {
           var contrato = db.collection("contrato");
           contrato.save(dados)
           .then(val => {
              res.status(200).json(val).end()
           }, err => {
              res.status(501).json(err).end()
           });
         }
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
         res.status(200).json(val).end()
      }, err => {
         res.status(501).json(err).end()
      });
   };

   contrato.listarEmpresa = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query('FOR empresa IN empresa FOR contrato IN contrato FILTER contrato._key == @id and contrato.idEmpresa == empresa._key RETURN empresa',{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
            res.status(200).json(val).end()
         });
      });
   };

   contrato.listarTermo = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query('FOR termo IN termos FOR contrato IN contrato FILTER contrato._key == @id and contrato.idTermo == termo._key RETURN termo',{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
            res.status(200).json(val).end()
         });
      });
   };

   contrato.listarRegiao = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      db.query('FOR regiao IN regiao FOR contrato IN contrato FILTER contrato._key == @id and contrato.idRegiao == regiao._key RETURN regiao',{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
            res.status(200).json(val).end()
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
            res.status(200).json(val).end()
         }, err => {
            res.status(501).json(err).end()
         });
      }
   };

   contrato.deletar = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var contrato = db.collection("contrato");
      contrato.remove(id)
      .then(val => {
         res.status(200).json(val).end()
      }, err => {
         res.status(501).json(err).end()
      });
   };

   function verificarRegiao(db,id) {
     var resultado = 0;
     db.query("LET cont = (FOR contrato IN contrato FILTER contrato.idRegiao == @id RETURN contrato) RETURN length(cont)",{'id' : id})
     .then(cursor => {
       cursor.next()
       .then(val=> {
         resultado=val
         if (resultado!=0) {
           return 1;
         }
         else {
           return 0;
         }
       });
     });
   }


   return contrato;
}
